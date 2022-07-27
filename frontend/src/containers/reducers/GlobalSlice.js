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
            state.status = "idle";
        },
        Error: (state, action) => {
            state.error = action.payload;
            state.status = "error";
    },
        Logout: (state, action) => {
            state.isAuthenticated = false;
            state.userdata = initialState.username;
            state.error = null;
        },
        Search: (state, action) =>{
            state.SearchField = action.payload;
        },
        Loading: (state, action)=>{
            state.status = "loading";
        },
        domainsLoaded: (state, action)=>{
            state.domains = action.payload;
            state.status = "idle";
            state.error = null;
        },
}
});

const search = (state) => state.SearchField;
export const selectSearch = createSelector(search, item => item);

export const fetchEntity = (uri, action)  => (dispatch) => {
    dispatch(Loading());
    apiClient.get(uri)
        .then(res=>dispatch(action(res.data)))
        .catch(err=>dispatch(Error(err.message)))
};

const domains = (state) => state.domains;
export const selectDomains = createSelector(domains, item => item);

const {actions, reducer} = globalSlice;
export const {
    Login, Logout, Error,Search,domainsLoaded,Loading,
} = actions;


export default reducer;