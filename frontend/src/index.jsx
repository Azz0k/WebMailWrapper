import React, {StrictMode} from 'react';
import { createRoot } from 'react-dom/client';
import App from './containers/components/App/App.jsx';
import {Provider} from "react-redux";
import store from "./store";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 0,
    },
  },
});


const container = document.getElementById('content');
const root = createRoot(container);
root.render(
    <StrictMode>
        <Provider store={store}>
             <QueryClientProvider client={queryClient}>
                 <App/>
             </QueryClientProvider>
        </Provider>
    </StrictMode>
);
