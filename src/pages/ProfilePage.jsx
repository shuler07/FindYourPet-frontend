import "./ProfilePage.css";

import { useEffect, useRef, useState, useContext } from "react";
import { AppContext } from "../App";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AdsContainer from "../components/AdsContainer";

import { API_PATHS, DEBUG } from "../data";
import { RestartAnim } from "../functions";

export default function ProfilePage() {
    const _name = window.localStorage.getItem("user_name"),
        _date = window.localStorage.getItem("user_date"),
        _email = window.localStorage.getItem("user_email"),
        _phone = window.localStorage.getItem("user_phone");

    const [userName, setUserName] = useState(_name ? _name : "");
    const [userDate, setUserDate] = useState(_date ? _date : "");
    const [userEmail, setUserEmail] = useState(_email ? _email : "");
    const [userPhone, setUserPhone] = useState(_phone ? _phone : "");
    useEffect(() => {
        GetUser();
    }, []);

    const { setAlert, alertRef } = useContext(AppContext);

    async function GetUser() {
        try {
            const response = await fetch(API_PATHS.user, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (DEBUG) console.debug("Getting user. Data received:", data);

            if (data.user) {
                if (data.user.name != userName) {
                    window.localStorage.setItem("user_name", data.user.name);
                    setUserName(data.user.name);
                }
                if (data.user.date != userDate) {
                    window.localStorage.setItem("user_date", data.user.date);
                    setUserDate(data.user.date);
                }
                if (data.user.email != userEmail) {
                    window.localStorage.setItem("user_email", data.user.email);
                    setUserEmail(data.user.email);
                }
                if (data.user.phone != userPhone) {
                    window.localStorage.setItem("user_phone", data.user.phone);
                    setUserPhone(data.user.phone);
                }
            }
        } catch (error) {
            console.error("Getting user. Error occured:", error);
        }
    }

    return (
        <>
            <Header />
            <div className="page-container">
                <ProfileCard
                    name={userName}
                    date={userDate}
                    email={userEmail}
                    phone={userPhone}
                />
                <AccountCard
                    name={userName}
                    setName={setUserName}
                    email={userEmail}
                    phone={userPhone}
                    setPhone={setUserPhone}
                    setAlert={setAlert}
                    alertRef={alertRef}
                />
                <PostedPetsCard setAlert={setAlert} alertRef={alertRef} />
                <SettingsCard />
            </div>
            <Footer />
        </>
    );
}

function ProfileCard({ name, date, email, phone }) {
    return (
        <section id="profile-card-section" className="card-section">
            <div id="profile-card-avatar">
                <img src="/images/avatar-not-found.png" />
                <div id="edit-avatar-button">
                    <img src="/icons/edit-pencil.svg" />
                </div>
            </div>
            <div id="profile-card-info">
                <h2>{name}</h2>
                <h6 style={{ marginTop: "-1.25rem" }}>
                    Зарегистрирован {date}
                </h6>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <div className="profile-card-field">
                        <h6>Почта</h6>
                        <h3>{email}</h3>
                    </div>
                    <div className="profile-card-field">
                        <h6>Телефон</h6>
                        <h3>{phone ? phone : "Не указан"}</h3>
                    </div>
                </div>
            </div>
        </section>
    );
}

function AccountCard({
    name,
    setName,
    email,
    phone,
    setPhone,
    setAlert,
    alertRef,
}) {
    return (
        <section id="account-card-section" className="card-section">
            <h5>Аккаунт</h5>
            <AccountNameField
                _name={name}
                setUserName={setName}
                setAlert={setAlert}
                alertRef={alertRef}
            />
            <AccountPhoneField
                _phone={phone}
                setUserPhone={setPhone}
                setAlert={setAlert}
                alertRef={alertRef}
            />
            <AccountEmailField
                _email={email}
                setAlert={setAlert}
                alertRef={alertRef}
            />
            <AccountPasswordField setAlert={setAlert} alertRef={alertRef} />
        </section>
    );
}

function AccountNameField({ _name, setUserName, setAlert, alertRef }) {
    const editButtonRef = useRef();

    const [disabled, setDisabled] = useState(true);
    const [name, setName] = useState("");
    useEffect(() => {
        setName(_name);
    }, [_name]);

    async function ChangeName() {
        try {
            const response = await fetch(API_PATHS.change_name, {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify({ name }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (DEBUG) console.debug("Changing name. Data received:", data);

            RestartAnim(alertRef.current);
            if (data.success) {
                setAlert({ text: "Имя успешно изменено", color: "green" });
                setUserName(name);
            } else
                setAlert({
                    text: "Ошибка при изменении имени. Попробуйте позже",
                    color: "red",
                });
        } catch (error) {
            console.error("Changing name. Error occured:", error);
            RestartAnim(alertRef.current);
            setAlert({
                text: "Ошибка при изменении имени. Что-то пошло не так",
                color: "red",
            });
        }
    }

    const handleClickEditButton = () => {
        if (disabled) {
            editButtonRef.current.classList.remove("disabled");
        } else {
            editButtonRef.current.classList.add("disabled");
            if (name == "" || name == _name) {
                RestartAnim(alertRef.current);
                if (name == "")
                    setAlert({ text: "Имя слишком короткое", color: "red" });
                else if (name == _name)
                    setAlert({
                        text: "Текущее имя совпадает с новым",
                        color: 'red',
                    });
                setName(_name);
            } else ChangeName();
        }
        setDisabled((prev) => !prev);
    };

    return (
        <div className="account-field">
            <h6>Имя</h6>
            <div style={{ position: "relative" }}>
                <input
                    className="account-edit-input"
                    type={null}
                    placeholder={_name}
                    disabled={disabled}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div
                    className="account-edit-button disabled"
                    onClick={handleClickEditButton}
                    ref={editButtonRef}
                >
                    <img />
                </div>
            </div>
        </div>
    );
}

function AccountPhoneField({ _phone, setUserPhone, setAlert, alertRef }) {
    const editButtonRef = useRef();

    const [disabled, setDisabled] = useState(true);
    const [phone, setPhone] = useState(_phone);
    useEffect(() => {
        setPhone(_phone);
    }, [_phone]);

    async function ChangePhone() {
        try {
            const response = await fetch(API_PATHS.change_phone, {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify({ phone }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (DEBUG) console.debug("Changing phone. Data received:", data);

            RestartAnim(alertRef.current);
            if (data.success) {
                setAlert({ text: "Телефон успешно изменен", color: "green" });
                setUserPhone(phone);
            } else
                setAlert({
                    text: "Ошибка при изменении телефона. Попробуйте позже",
                    color: "red",
                });
        } catch (error) {
            console.error("Changing phone. Error occured:", error);
            RestartAnim(alertRef.current);
            setAlert({
                text: "Ошибка при изменении телефона. Что-то пошло не так",
                color: "red",
            });
        }
    }

    const handleClickEditButton = () => {
        if (disabled) {
            editButtonRef.current.classList.remove("disabled");
        } else {
            editButtonRef.current.classList.add("disabled");
            if (
                phone.length != 12 ||
                !phone.startsWith("+7") ||
                phone == _phone
            ) {
                RestartAnim(alertRef.current);
                if (phone.length != 12 || !phone.startsWith("+7"))
                    setAlert({
                        text: "Неверный формат телефона",
                        color: "red",
                    });
                else if (phone == _phone)
                    setAlert({
                        text: "Текущий телефон совпадает с новым",
                        color: "red",
                    });
                setPhone(_phone);
                setAlert({ text: "Неверный формат телефона", color: "red" });
            } else ChangePhone();
        }
        setDisabled((prev) => !prev);
    };

    return (
        <div className="account-field">
            <h6>Телефон</h6>
            <div style={{ position: "relative" }}>
                <input
                    className="account-edit-input"
                    type="phone"
                    placeholder={_phone ? _phone : "Не указан"}
                    disabled={disabled}
                    value={phone ? phone : ""}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <div
                    className="account-edit-button disabled"
                    onClick={handleClickEditButton}
                    ref={editButtonRef}
                >
                    <img />
                </div>
            </div>
        </div>
    );
}

function AccountEmailField({ _email, setAlert, alertRef }) {
    const editButtonRef = useRef();

    const [disabled, setDisabled] = useState(true);
    const [email, setEmail] = useState(_email);
    useEffect(() => {
        setEmail(_email);
    }, [_email]);

    const { setSignedIn } = useContext(AppContext);

    async function ChangeEmail() {
        try {
            const response = await fetch(API_PATHS.change_email, {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify({ email }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (DEBUG) console.debug("Changing email. Data received:", data);

            // TODO: verification
            RestartAnim(alertRef.current);
            if (data.success) {
                setSignedIn(false);
                window.localStorage.removeItem("user_name");
                window.localStorage.removeItem("user_date");
                window.localStorage.removeItem("user_email");
                window.localStorage.removeItem("user_phone");
                window.location.pathname = "/";
            } else
                setAlert({
                    text: "Ошибка при изменении почты. Попробуйте позже",
                    color: "red",
                });
        } catch (error) {
            console.error("Changing email. Error occured:", error);
            RestartAnim(alertRef.current);
            setAlert({
                text: "Ошибка при изменении почты. Что-то пошло не так",
                color: "red",
            });
        }
    }

    const handleClickEditButton = () => {
        if (disabled) {
            editButtonRef.current.classList.remove("disabled");
        } else {
            editButtonRef.current.classList.add("disabled");
            if (email == "" || !email.includes("@") || email == _email) {
                RestartAnim(alertRef.current);
                if (email == "" || !email.includes("@"))
                    setAlert({ text: "Неверный формат почты", color: "red" });
                else if (email == _email)
                    setAlert({ text: "Текущая почта совпадает с новой", color: 'red' });
                setEmail(_email);
            } else ChangeEmail();
        }
        setDisabled((prev) => !prev);
    };

    return (
        <div className="account-field">
            <h6>Почта</h6>
            <div style={{ position: "relative" }}>
                <input
                    className="account-edit-input"
                    type="email"
                    placeholder={_email}
                    disabled={disabled}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div
                    className="account-edit-button disabled"
                    onClick={handleClickEditButton}
                    ref={editButtonRef}
                >
                    <img />
                </div>
            </div>
        </div>
    );
}

function AccountPasswordField({ setAlert, alertRef }) {
    const editButtonRef = useRef();

    const [disabled, setDisabled] = useState(true);

    const [curPassword, setCurPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    async function ChangePassword() {
        try {
            const response = await fetch(API_PATHS.change_password, {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify({ curPassword, newPassword }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (DEBUG) console.debug("Changing password. Data received:", data);

            RestartAnim(alertRef.current);
            if (data.success)
                setAlert({ text: "Пароль успешно изменен", color: "green" });
            else setAlert({ text: "Неверный пароль", color: "red" });
        } catch (error) {
            console.error("Changing password. Error occured:", error);
            RestartAnim(alertRef.current);
            setAlert({
                text: "Ошибка при изменении пароля. Что-то пошло не так",
                color: "red",
            });
        }
    }

    const handleClickEditButton = () => {
        if (disabled) {
            editButtonRef.current.classList.remove("disabled");
        } else {
            editButtonRef.current.classList.add("disabled");
            if (
                curPassword.length < 8 ||
                newPassword.length < 8 ||
                curPassword == newPassword
            ) {
                RestartAnim(alertRef.current);
                if (curPassword.length < 8 || newPassword.length < 8)
                    setAlert({
                        text: "Минимальная длина пароля - 8 символов",
                        color: "red",
                    });
                else if (curPassword == newPassword)
                    setAlert({
                        text: "Текущий и новый пароль совпадают",
                        color: "red",
                    });
                setCurPassword("");
                setNewPassword("");
            } else ChangePassword();
        }
        setDisabled((prev) => !prev);
    };

    return (
        <div className="account-field">
            <h6>Пароль</h6>
            <div style={{ position: "relative" }}>
                <input
                    className="account-edit-input"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Текущий пароль"
                    disabled={disabled}
                    value={curPassword}
                    onChange={(e) => setCurPassword(e.target.value)}
                />
                <div
                    className="account-edit-button disabled"
                    onClick={handleClickEditButton}
                    ref={editButtonRef}
                >
                    <img />
                </div>
            </div>
            {!disabled && (
                <input
                    style={{
                        paddingLeft: "1rem",
                        width: "calc(100% - 1.5rem)",
                    }}
                    className="account-edit-input"
                    type="password"
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            )}
        </div>
    );
}

function PostedPetsCard({ setAlert, alertRef }) {
    const [myAds, setMyAds] = useState([]);
    useEffect(() => {
        GetMyAds();
    }, []);

    async function GetMyAds() {
        try {
            const response = await fetch(API_PATHS.get_my_ads, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (DEBUG) console.debug("Getting my ads. Data received:", data);

            if (data.success) setMyAds(data.ads);
            else {
                RestartAnim(alertRef.current);
                setAlert({
                    text: "Ошибка при получении ваших объявлений. Попробуйте позже",
                    color: "red",
                });
            }
        } catch (error) {
            console.error("Getting my ads. Error occured:", error);
            RestartAnim(alertRef.current);
            setAlert({
                text: "Ошибка при получении ваших объявлений. Что-то пошло не так",
                color: "red",
            });
        }
    }

    return (
        <section id="posted-pets-card-section" className="card-section">
            <h5>
                Опубликованные объявления{" "}
                <span
                    style={{
                        color: "color-mix(in srgb, var(--inverse-color), white 50%)",
                    }}
                >
                    {myAds.length}
                </span>
            </h5>
            <AdsContainer ads={myAds} />
        </section>
    );
}

function SettingsCard() {
    return (
        <section id="settings-card-section" className="card-section">
            <h5>Настройки</h5>
        </section>
    );
}
