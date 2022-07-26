import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    SearchField: '',
}

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers:{
        Search: (state, action) =>{
            state.SearchField = action.payload;
        },
    }
});

export const {Search} = searchSlice.actions;
export default searchSlice.reducer;