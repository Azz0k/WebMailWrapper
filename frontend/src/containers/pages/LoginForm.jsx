import React, { useState } from "react";
import {Login} from "../reducers";
import apiClient from "../service";
import {useDispatch} from "react-redux";
import {Error} from "../reducers";

const LoginForm = () => {
    const dispatch = useDispatch()
    const [username, setEmaiValue] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = (event) => {
        event.preventDefault();
        apiClient.post('/login',{username,password})
            .then(response=>{
                dispatch(Login({username, password}))
            })
            .catch(error=>dispatch(Error(error.message)));
    };
    
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4 col-sm-12">
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <h2>Вход</h2>
                        <p>Введите ваши учетные данные</p>
                        <form action="" method="post" onSubmit={event => handleSubmit(event)}>
                            <div className="form-group login-input">
                                <label>Адрес электронной почты</label>
                                <input
                                    autoFocus
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    required
                                    value={username}
                                    onChange={event => setEmaiValue(event.target.value)}
                                />
                            </div>
                            <div className="form-group login-input">
                                <label>Пароль</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    required
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                />
                            </div>
                            <div className="form-group login-input">
                                <input
                                    type="submit"
                                    name="submit"
                                    className="btn btn-primary"
                                    value="Войти"
                                /> 
                            </div>
                        </form>
                    </div>
                    <div className="col-md-4 col-sm-12">
                    </div>
                </div>
            </div>
        </>);
};

export default LoginForm;


