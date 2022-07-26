import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    domains: [],
    status: "idle"
};

const domainSlice = createSlice({
    name:"domains",
    initialState,
    reducers:{
        domainsLoading: (state, action)=>{
            state.status = "loading";
        },
        domainsLoaded: (state, action)=>{
            state.domains = action.payload;
            state.status = "idle";
        }
    }
});

export const {domainsLoaded,domainsLoading} = domainSlice.actions;
export default domainSlice.reducer;