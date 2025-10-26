import "./Header.css";

import { useContext } from "react";
import { AppContext } from "../App";

import { useNavigate } from "react-router-dom";

export default function Header() {
    const { signedIn } = useContext(AppContext);

    const navigate = useNavigate();

    return (
        <div id="header">
            <img
                id="headerLogo"
                src="./images/logo.png"
                onClick={() => navigate("/")}
            />
            <HeaderBar signedIn={signedIn} />
        </div>
    );
}

function HeaderBar({ signedIn }) {
    const navigate = useNavigate();

    return (
        <div id="headerBar">
            <div className="headerButton accent" onClick={() => {}}>
                <h3>помощь</h3>
            </div>
            <div
                className="headerButton primary"
                onClick={() => {
                    signedIn ? navigate("/profile") : navigate("/signin");
                }}
            >
                <h6>{signedIn ? "профиль" : "войти"}</h6>
            </div>
        </div>
    );
}
