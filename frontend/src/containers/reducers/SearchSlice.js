import {createSelector, createSlice} from "@reduxjs/toolkit";

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

const search = (state) => state.search.SearchField;
export const selectSearch = createSelector(search, item => item);
export const {Search} = searchSlice.actions;
export default searchSlice.reducer;