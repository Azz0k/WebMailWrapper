import { configureStore } from '@reduxjs/toolkit';
import reducer from "./containers/reducers/GlobalSlice";

const store = configureStore({reducer});

export default store;