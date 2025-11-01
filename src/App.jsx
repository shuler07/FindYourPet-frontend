import { useEffect, useState, createContext } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage";
import SigninPage from "./pages/SigninPage";
import HelpPage from "./pages/HelpPage";
import CreateAdPage from "./pages/CreateAdPage";
import SearchAdsPage from "./pages/SearchAdsPage";
import AuthorsPage from "./pages/AuthorsPage";

import { API_PATHS, DEBUG } from "./data";

export const AppContext = createContext();

export default function App() {
    const [signedIn, setSignedIn] = useState(true);
    // useEffect(() => {
    //     CheckAuth();
    // }, []);

    async function CheckAuth() {
        try {
            const response = await fetch(API_PATHS.auth, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (DEBUG) console.debug("Authentication. Data received:", data);
        } catch (error) {
            console.error("Authentication. Error occured:", error);
        }
    }

    return (
        <AppContext.Provider value={{ signedIn, setSignedIn }}>
            <Router>
                <Routes>
                    <Route index element={<MainPage />} />
                    <Route path="/signin" element={<SigninPage />} />
                    <Route path="/help" element={<HelpPage />} />
                    <Route path="/ads/create" element={<CreateAdPage />} />
                    <Route path="/ads" element={<SearchAdsPage />} />
                    <Route path="/authors" element={<AuthorsPage />} />
                </Routes>
            </Router>
        </AppContext.Provider>
    );
}
