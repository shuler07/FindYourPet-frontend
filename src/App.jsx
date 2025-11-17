import { useEffect, useRef, useState, createContext } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Alert from "./components/Alert";
import MainPage from "./pages/MainPage";
import SigninPage from "./pages/SigninPage";
import HelpPage from "./pages/HelpPage";
import SearchAdsPage from "./pages/SearchAdsPage";
import CreateAdPage from "./pages/CreateAdPage";
import AdPage from "./pages/AdPage";
import AuthorsPage from "./pages/AuthorsPage";
import ProfilePage from "./pages/ProfilePage";

import { API_PATHS, DEBUG } from "./data";

export const AppContext = createContext();

export default function App() {
    const [signedIn, setSignedIn] = useState(false);
    useEffect(() => {
        CheckAuth();
    }, []);

    const [alert, setAlert] = useState({ text: null, color: null });
    const alertRef = useRef();

    async function CheckAuth() {
        try {
            const response = await fetch(API_PATHS.auth, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (DEBUG) console.debug("Authentication. Data received:", data);

            if (data.success) setSignedIn(true);
            else {
                if (data.detail == "Токен недействителен или истёк") {
                    RefreshAuth();
                }
            }
        } catch (error) {
            console.error("Authentication. Error occured:", error);
        }
    }

    async function RefreshAuth() {
        try {
            const response = await fetch(API_PATHS.refresh, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (DEBUG) console.debug("Refreshing. Data received:", data);

            if (data.success) setSignedIn(true);
        } catch (error) {
            console.error("Refreshing. Error occured:", error);
        }
    }

    return (
        <AppContext
            value={{
                signedIn,
                setSignedIn,
                setAlert,
                alertRef,
            }}
        >
            <Router>
                <Routes>
                    <Route index element={<MainPage />} />
                    <Route path="/signin" element={<SigninPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/help" element={<HelpPage />} />
                    <Route path="/ads/create" element={<CreateAdPage />} />
                    <Route path="/ads" element={<SearchAdsPage />} />
                    <Route path="/ad" element={<AdPage />} />
                    <Route path="/authors" element={<AuthorsPage />} />
                </Routes>
            </Router>
            <Alert text={alert.text} color={alert.color} ref={alertRef} />
        </AppContext>
    );
}
