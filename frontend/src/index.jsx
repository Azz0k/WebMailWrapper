import React, {StrictMode} from 'react';
import { createRoot } from 'react-dom/client';
import App from './containers/components/App/App.jsx';
import {Provider} from "react-redux";
import store from "./store";
import "core-js/stable";
import "regenerator-runtime/runtime";
import {fetchEntity, Login} from "./containers/reducers/GlobalSlice";


store.dispatch(fetchEntity("/login", Login))
const container = document.getElementById('content');
const root = createRoot(container);
root.render(

        <Provider store={store}>
                 <App/>
        </Provider>

);
