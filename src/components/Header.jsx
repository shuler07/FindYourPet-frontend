import "./Header.css";

import { useContext } from "react";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const { signedIn } = useContext(AppContext);

    const navigate = useNavigate();

    return (
        <header>
            <img
                id="header-logo"
                src="/images/logo.png"
                onClick={() => navigate('/')}
            />
            <HeaderBar signedIn={signedIn} />
        </header>
    );
}

function HeaderBar({ signedIn }) {
    const navigate = useNavigate();

    return (
        <div id="header-bar">
            <div
                className="header-button accent"
                onClick={() => navigate("/help")}
            >
                <h3>помощь</h3>
            </div>
            <div
                className="header-button primary"
                onClick={() => {
                    signedIn ? navigate("/profile") : navigate("/signin");
                }}
            >
                <h6>{signedIn ? "профиль" : "войти"}</h6>
            </div>
        </div>
    );
}
