import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import LoginForm from "../../pages/LoginForm";
import Header from "../Header/Header";


const ErrorLog = () =>{
    const error = useSelector(state => state.error);
    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12 d-flex justify-content-center text-danger">
                    {error}
                </div>
            </div>
        </div>
    );
};

const Layout = ({children}) => {
    const isAuthenticated = useSelector(state => state.isAuthenticated);
    const component_to_render = isAuthenticated ? children : <LoginForm />
    return(
        <>
            <Header/>
            <ErrorLog/>
            <main>
                <div>
                    {component_to_render}
                </div>
            </main>

        </>
    );
}

export default Layout;