import "./SigninPage.css";

import { useEffect, useRef, useState } from "react";

import InputLabeled from "../components/InputLabeled";
import { useNavigate } from "react-router-dom";

export default function SigninPage() {
    const [isRegister, setIsRegister] = useState(false);
    useEffect(() => {
        const elem = document.getElementById('right-form-fields');

        elem.style.display = 'none';
        void elem.offsetWidth;
        elem.style.display = 'flex';
    }, [isRegister]);

    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const confirmPasswordRef = useRef();

    return (
        <div id="signin-page-container">
            <div id="signin-form">
                <BackButton />
                <div id="left-form">
                    <h1 style={{ color: 'white' }}>Find Your Pet</h1>
                    <h2 style={{ color: 'white' }}>Найди своего питомца</h2>
                    <h6 style={{ color: 'white' }}>
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
                        />
                        <InputLabeled
                            inputId="password-field"
                            type="password"
                            placeholder="********"
                            autoComplete="current-password"
                            label="Пароль"
                            ref={passwordInputRef}
                        />
                        {isRegister && (
                            <InputLabeled
                                inputId="confirm-password-field"
                                type="password"
                                placeholder="********"
                                autoComplete="new-password"
                                label="Подтвердите пароль"
                                ref={confirmPasswordRef}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function BackButton() {
    const navigate = useNavigate();

    return (
        <div id='signin-back' onClick={() => navigate('/')}>
            <img src='./icons/left-arrow.svg' />
            <h6>На главную</h6>
        </div>
    )
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
                    !isRegister && "active"
                }`}
                onClick={() => setIsRegister(false)}
            >
                <h3>вход</h3>
            </div>
            <div
                className={`right-form-toogle-button ${isRegister && "active"}`}
                onClick={() => setIsRegister(true)}
            >
                <h3>регистрация</h3>
            </div>
        </div>
    );
}
