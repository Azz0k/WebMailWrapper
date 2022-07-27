import { configureStore } from '@reduxjs/toolkit';
import loginReducer from "./containers/reducers/LoginSlice";
import searchReducer from "./containers/reducers/SearchSlice";
import domainReducer from "./containers/reducers/DomainSlice";

const store = configureStore({
    reducer:{
        login: loginReducer,
        search: searchReducer,
        domains: domainReducer,
    }
});

export default store;