import {createSelector, createSlice} from "@reduxjs/toolkit";
import apiClient from "../service";

const initialState = {
    items: [],
    status: "idle",
    error: null,
};

const domainSlice = createSlice({
    name:"domains",
    initialState,
    reducers:{
        domainsLoading: (state, action)=>{
            state.status = "loading";
        },
        domainsFailed:(state, action)=>{
            state.status = "error";
            state.error = action.payload;
        },
        domainsLoaded: (state, action)=>{
            state.items = action.payload;
            state.status = "idle";
        }
    }
});

export const fetchDomains = () => (dispatch) => {
    dispatch(domainsLoading());
    apiClient.get("/domains")
        .then(res=>dispatch(domainsLoaded(res.data)))
        .catch(err=>dispatch(domainsFailed(err.message)))
};
const domains = (state) => state.domains;
export const selectDomains = createSelector(domains, item => item);
export const {domainsLoaded,domainsLoading, domainsFailed} = domainSlice.actions;
export default domainSlice.reducer;