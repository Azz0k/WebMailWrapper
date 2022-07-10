import { configureStore } from '@reduxjs/toolkit';
import reducer from "./containers/reducers";
const store = configureStore({reducer});
export default store;