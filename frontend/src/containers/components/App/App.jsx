import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavTabs from "../../pages/NavTabs";
import Layout from "../Layout/Layout";
import NotFound from "../../pages/NotFound";


const App = () => {
    return (
            <Router>
                <Layout>
                    <Routes>
                        <Route exact path="/" element={<NavTabs/>} />
                        <Route path="*" element={<NotFound/>} />
                    </Routes>
                </Layout>
            </Router>
        );
};

export default App;