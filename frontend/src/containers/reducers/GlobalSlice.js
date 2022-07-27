import {createSelector, createSlice} from '@reduxjs/toolkit';
import apiClient from "../service";


const initialState = {
    username: null,
    isAuthenticated: false,
    error: null,
    SearchField: '',
    domains: [],
    status: "idle",

};

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        Login: (state, action) => {
            state.isAuthenticated = true;
            state.username = action.payload;
            state.error = null;
        },
        Error: (state, action) => {
            state.error = action.payload;
    },
        Logout: (state, action) => {
            state.isAuthenticated = false;
            state.userdata = initialState.username;
            state.error = null
        },
        Search: (state, action) =>{
            state.SearchField = action.payload;
        },
        domainsLoading: (state, action)=>{
            state.status = "loading";
        },
        domainsFailed:(state, action)=>{
            state.status = "error";
            state.error = action.payload;
        },
        domainsLoaded: (state, action)=>{
            state.domains = action.payload;
            state.status = "idle";
        },
}
});

const search = (state) => state.SearchField;
export const selectSearch = createSelector(search, item => item);

export const fetchDomains = () => (dispatch) => {
    dispatch(domainsLoading());
    apiClient.get("/domains")
        .then(res=>dispatch(domainsLoaded(res.data)))
        .catch(err=>dispatch(domainsFailed(err.message)))
};

const domains = (state) => state.domains;
export const selectDomains = createSelector(domains, item => item);

const {actions, reducer} = globalSlice;
export const {
    Login, Logout, Error,Search,domainsLoaded,domainsLoading, domainsFailed,
} = actions;


export default reducer;