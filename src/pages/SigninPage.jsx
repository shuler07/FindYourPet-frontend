import "./SigninPage.css";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import InputLabeled from "../components/InputLabeled";

import { API_PATHS, DEBUG } from "../data";
import { RestartAnim } from "../functions";

export default function SigninPage() {
    const [isRegister, setIsRegister] = useState(false);
    useEffect(() => {
        const elem = document.getElementById("right-form-fields");
        RestartAnim(elem);
    }, [isRegister]);

    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const confirmPasswordRef = useRef();

    const credsValid = (email, password, confirm_password) => {
        if (email == "") return false;
        if (password.length < 8) return false;
        if (confirm_password != null && password != confirm_password)
            return false;
        return true;
    };

    const authenticateUser = () => (isRegister ? RegisterUser() : LoginUser());

    async function RegisterUser() {
        const email = emailInputRef.current.value,
            password = passwordInputRef.current.value,
            confirm_password = confirmPasswordRef.current.value;

        if (!credsValid(email, password, confirm_password)) return;

        try {
            const response = await fetch(API_PATHS.register, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ email, password, confirm_password }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (DEBUG) console.debug("Registering. Data received:", data);
        } catch (error) {
            console.error("Registering. Error occured:", error);
        }
    }

    async function LoginUser() {
        const email = emailInputRef.current.value,
            password = passwordInputRef.current.value;

        if (!credsValid(email, password, null)) return;

        try {
            const response = await fetch(API_PATHS.login, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (DEBUG) console.debug("Logining. Data received:", data);
        } catch (error) {
            console.error("Logining. Error occured:", error);
        }
    }

    return (
        <div id="signin-page-container">
            <div id="signin-form">
                <BackButton />
                <div id="left-form">
                    <h1 style={{ color: "white", opacity: 0 }}>
                        Find Your Pet
                    </h1>
                    <h2 style={{ color: "white", opacity: 0 }}>
                        Найди своего питомца
                    </h2>
                    <h6 style={{ color: "white", opacity: 0 }}>
                        Присоединяйтесь к нашему сообществу, чтобы помочь
                        животным обрести дом или найти своих потерянных
                        любимцев.
                    </h6>
                </div>
                <div id="right-form">
                    <RightFormToogleContainer
                        isRegister={isRegister}
                        setIsRegister={setIsRegister}
                    />
                    <div id="right-form-fields">
                        <InputLabeled
                            inputId="email-field"
                            type="email"
                            placeholder="example@mail.com"
                            autoComplete="email"
                            label="Почта"
                            ref={emailInputRef}
                            value={
                                emailInputRef.current
                                    ? emailInputRef.current.value
                                    : ""
                            }
                        />
                        <InputLabeled
                            inputId="password-field"
                            type="password"
                            placeholder="********"
                            autoComplete="current-password"
                            label="Пароль"
                            ref={passwordInputRef}
                            value={
                                passwordInputRef.current
                                    ? passwordInputRef.current.value
                                    : ""
                            }
                        />
                        {isRegister && (
                            <InputLabeled
                                inputId="confirm-password-field"
                                type="password"
                                placeholder="********"
                                autoComplete="new-password"
                                label="Подтвердите пароль"
                                ref={confirmPasswordRef}
                                value={
                                    confirmPasswordRef.current
                                        ? confirmPasswordRef.current.value
                                        : ""
                                }
                            />
                        )}
                    </div>
                    <AuthButton
                        isRegister={isRegister}
                        event={authenticateUser}
                    />
                    {!isRegister && <ForgetPasswordButton />}
                </div>
            </div>
        </div>
    );
}

function BackButton() {
    const navigate = useNavigate();

    return (
        <div id="signin-back" onClick={() => navigate("/")}>
            <img src="/icons/left-arrow.svg" />
            <h6>На главную</h6>
        </div>
    );
}

function RightFormToogleContainer({ isRegister, setIsRegister }) {
    return (
        <div id="right-form-toogle-container">
            <div
                id="right-form-active-button"
                className={`${isRegister && "register"}`}
            />
            <div
                className={`right-form-toogle-button ${
                    !isRegister ? "active" : ""
                }`}
                onClick={() => setIsRegister(false)}
            >
                <h3>вход</h3>
            </div>
            <div
                className={`right-form-toogle-button ${
                    isRegister ? "active" : ""
                }`}
                onClick={() => setIsRegister(true)}
            >
                <h3>регистрация</h3>
            </div>
        </div>
    );
}

function AuthButton({ isRegister, event }) {
    return (
        <button id="auth-button" className="primary-button" onClick={event}>
            <h3>{isRegister ? "Зарегистрироваться" : "Войти"}</h3>
            <img src="/icons/right-arrow.svg" />
        </button>
    );
}

function ForgetPasswordButton() {
    return (
        <div id="forget-password-button">
            <h3>Забыли пароль?</h3>
        </div>
    );
}
