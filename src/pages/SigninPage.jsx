import "./SigninPage.css";

import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";

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

    const navigate = useNavigate();

    const { setSignedIn } = useContext(AppContext);

    const credsValid = (email, password, confirm_password) => {
        let flag = true;

        if (email == "") {
            flag = false;
            emailInputRef.current.classList.add("wrong-field");
        }
        if (password.length < 8) {
            flag = false;
            passwordInputRef.current.classList.add("wrong-field");
        }
        if (
            confirm_password != null &&
            (confirm_password.length < 8 || password != confirm_password)
        ) {
            flag = false;
            confirmPasswordRef.current.classList.add("wrong-field");
        }

        return flag;
    };

    const authenticateUser = () => {
        isRegister ? RegisterUser() : LoginUser();
    };

    async function RegisterUser() {
        const email = emailInputRef.current.value;
        const password = passwordInputRef.current.value;
        const confirm_password = confirmPasswordRef.current.value;

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
        const email = emailInputRef.current.value;
        const password = passwordInputRef.current.value;

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

            if (data.success) {
                setSignedIn(true);
                navigate('/');
            };
        } catch (error) {
            console.error("Logining. Error occured:", error);
        }
    }

    return (
        <div id="signin-page-container" className="gradient-accent">
            <form id="signin-form">
                <BackButton />
                <div id="left-form" className="gradient-primary">
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
            </form>
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
        <div id="right-form-toogle-container" className="gradient-accent">
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
        <button
            id="auth-button"
            className="primary-button"
            type="button"
            onClick={event}
        >
            {isRegister ? "Зарегистрироваться" : "Войти"}
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
