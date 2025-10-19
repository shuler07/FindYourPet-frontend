import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage";
import { BASE_PATHNAME } from "./data";


export default function App() {
    return (
        <Router basename={BASE_PATHNAME}>
            <Routes>
                <Route index element={<MainPage />} />
            </Routes>
        </Router>
    );
}
