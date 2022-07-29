import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import LoginForm from "../../pages/LoginForm";
import Header from "../Header/Header";
import {domainsLoaded, fetchEntity, selectDomains, usersFromDomainLoaded} from "../../reducers/GlobalSlice";


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
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.isAuthenticated);
    const component_to_render = isAuthenticated ? children : <LoginForm />
    const domains = useSelector(selectDomains);
    useEffect(()=>{
        if (isAuthenticated) {
            dispatch(fetchEntity("/domains", domainsLoaded));
        }
    },[isAuthenticated]);
    useEffect(()=>{
        if (domains) {
            //TODO переделать, сделать загрузку сначала основного домена, а потом все остальное
            domains.forEach(domain=>dispatch(fetchEntity("/1.0/"+domain, usersFromDomainLoaded)));
        }
    },[domains]);
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