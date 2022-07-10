import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    userdata: {
        username: null,
        password: null,
    },
    isAuthenticated: false,
    error: null,
};

const usersByDomains = createSlice({
    name: 'usersByDomains',
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
    },
}
});

const {actions, reducer} = usersByDomains;
export const {
    Login, Logout, Error
} = actions;


export default  reducer;