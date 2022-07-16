import itertools
from tempfile import mkdtemp
from flask import request, Flask, json, jsonify, abort, session
import flask_cors
import helper
from werkzeug.exceptions import HTTPException
import re
from CGPCLI.Errors import FailedLogin, ConnectionTimeOut
from flask_session import Session
from typing import *
import concurrent.futures


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config.update(DEBUG=True,
                  SECRET_KEY='3e33a45081c21b6b7a958094726f8b5c4aa6a098a71fc3c2782b5d2e59a18886',
                  SESSION_COOKIE_HTTPONLY=True,
                  REMEMBER_COOKIE_HTTPONLY=True,
                  SESSION_COOKIE_SAMESITE='Strict',
                  )
flask_cors.CORS(app, supports_credentials=True)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
# Раскоментировать при переносе на рабочий сервер, чтобы session сохранялась на сервере
# иначе логин и пароль хранится в куке в браузере, не надо вводить каждый раз при рестарте dev сервера
#Session(app)
regex = re.compile(r'[\w.]+@\w+\.ru')

if app.config["DEBUG"]:
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response


def clear_session_data():
    session.pop('username', None)
    session.pop('password', None)


def get_function(function: Callable) -> Any:
    def wrapper(*args):
        result = None
        if ('username' not in session) and ('password' not in session):
            abort(401)
        try:
            result = function(*args)
        except TimeoutError:
            abort(500, description="Timeout ")
        except (FailedLogin, ConnectionTimeOut):
            clear_session_data()
            abort(401)
        return jsonify(result)
    return wrapper


@app.errorhandler(HTTPException)
def handle_exception(e):
    response = e.get_response()
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    return response


def user_setting_pool_worker(*args):
    account_name, d_n, u_n, u_p = args[0]
    local_helper: helper.CGPROHelper = helper.CGPROHelper(u_n, u_p)
    return local_helper.get_user_settings(account_name, d_n)


@get_function
@app.route('/api/1.0/<string:domain_name>', methods=['GET'])
def get_users_settings(domain_name):
    mail_serv: helper.CGPROHelper = helper.CGPROHelper(session['username'], session['password'])
    users_names = mail_serv.get_users(domain_name)
    temp_tuple = zip(users_names,
                     itertools.repeat(domain_name),
                     itertools.repeat(session['username']),
                     itertools.repeat(session['password']))

    with concurrent.futures.ProcessPoolExecutor() as executor:
        users_data = dict(zip(users_names, executor.map(user_setting_pool_worker, temp_tuple)))
    return users_data


@get_function
@app.route('/api/users', methods=['GET'])
def new_all_users():
    mail_serv: helper.CGPROHelper = helper.CGPROHelper(session['username'], session['password'])
    users = mail_serv.get_all_users_by_domains()
    return users


@app.route('/api/logout')
def logout():
    clear_session_data()
    return jsonify({'http:200'})


@app.route('/api/login', methods=['GET', 'POST'])
def login():
    data = {}
    if request.method == 'GET':
        if ('username' in session) and ('password' in session):
            data['username'] = session['username']
            data['password'] = session['password']
        else:
            clear_session_data()
            abort(401)
    if request.method == 'POST':
        data = request.json
    domains = None
    if ('username' in data) and ('password' in data) and (re.fullmatch(regex, data['username'])):
        mail_server: helper.CGPROHelper = helper.CGPROHelper(data['username'], data['password'])
        try:
            domains = mail_server.get_domains()
        except TimeoutError:
            abort(500, description="Timeout ")
        except (FailedLogin, ConnectionTimeOut):
            clear_session_data()
            abort(401)
        if domains:
            session['username'] = data['username']
            session['password'] = data['password']
            return jsonify({'http': 200, 'username': session['username']})
    abort(401)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
