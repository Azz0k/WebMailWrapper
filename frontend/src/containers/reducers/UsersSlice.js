import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    usersData: {},
    usersDataStatus:'idle',
};

const UsersSlice = createSlice({
    name: "users",
    initialState,
    reducers:{
    }
});