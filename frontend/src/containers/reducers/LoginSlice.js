import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    headUserData: {
        username: null,
        password: null,
    },
    isAuthenticated: false,
    error: null,

};

const loginSlice = createSlice({
    name: 'login',
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
            state.userdata = initialState.headUserData;
            state.error = null
        },
}
});


const {actions, reducer} = loginSlice;
export const {
    Login, Logout, Error,
} = actions;


export default reducer;