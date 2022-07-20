import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    userdata: {
        username: null,
        password: null,
    },
    isAuthenticated: false,
    error: null,
    SearchField: '',
};

const firstSlice = createSlice({
    name: 'firstSlice',
    initialState,
    reducers: {
        Login: (state, action) => {
            state.isAuthenticated = true;
            state.userdata = action.payload;
            state.error = null;
        },
        Error: (state, action) => {
            state.error = action.payload;
    },
        Logout: (state, action) => {
            state.isAuthenticated = false;
            state.userdata = initialState.userdata;
            state.error = null
        },
        Search: (state, action) =>{
            state.SearchField = action.payload;
        },
}
});


const {actions, reducer} = firstSlice;
export const {
    Login, Logout, Error, Search,
} = actions;


export default  reducer;