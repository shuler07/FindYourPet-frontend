import { useEffect, useState, createContext } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage";
import SigninPage from "./pages/SigninPage";
import { BASE_PATHNAME } from "./data";

export const AppContext = createContext();

export default function App() {
    const [signedIn, setSignedIn] = useState(false);
    // useEffect(() => {
    //     CheckAuth();
    // }, []);

    function CheckAuth() {}

    return (
        <AppContext.Provider value={{ signedIn, setSignedIn }}>
            <Router basename={BASE_PATHNAME}>
                <Routes>
                    <Route index element={<MainPage />} />
                    <Route path="/signin" element={<SigninPage />} />
                </Routes>
            </Router>
        </AppContext.Provider>
    );
}
