import "./ProfilePage.css";

import { useEffect, useRef, useState, useContext } from "react";
import { AppContext } from "../App";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AdsContainer from "../components/AdsContainer";

import { API_PATHS, DEBUG } from "../data";
import { RestartAnim } from "../functions";

export default function ProfilePage() {
    const [user, setUser] = useState({
        name: "",
        date: "",
        email: "",
        phone: "",
    });
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

            if (data.user) setUser(data.user);

            setUser({
                name: "Test name",
                date: "01.01.2025",
                email: "some@email.com",
                phone: "+7 (123) 456-78-90",
            });
        } catch (error) {
            console.error("Getting user. Error occured:", error);
        }
    }

    return (
        <>
            <Header />
            <div className="page-container">
                <ProfileCard {...user} />
                <AccountCard
                    {...user}
                    setAlert={setAlert}
                    alertRef={alertRef}
                />
                <PostedPetsCard />
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
                        <h3>{phone}</h3>
                    </div>
                </div>
            </div>
        </section>
    );
}

function AccountCard({ name, email, phone, setAlert, alertRef }) {
    return (
        <section id="account-card-section" className="card-section">
            <h5>Аккаунт</h5>
            <AccountNameField
                _name={name}
                setAlert={setAlert}
                alertRef={alertRef}
            />
            <AccountPhoneField
                _phone={phone}
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

function AccountNameField({ _name, setAlert, alertRef }) {
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
            if (data.success)
                setAlert({ text: "Имя успешно изменено", color: "green" });
            else setAlert({ text: "Попробуйте позже", color: "red" });
        } catch (error) {
            console.error("Changing name. Error occured:", error);
            RestartAnim(alertRef.current);
            setAlert({ text: "Что-то пошло не так", color: "red" });
        }
    }

    const handleClickEditButton = () => {
        if (disabled) {
            editButtonRef.current.classList.remove("disabled");
        } else {
            editButtonRef.current.classList.add("disabled");
            ChangeName();
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

function AccountPhoneField({ _phone, setAlert, alertRef }) {
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
            if (data.success)
                setAlert({ text: "Телефон успешно изменен", color: "green" });
            else setAlert({ text: "Попробуйте позже", color: "red" });
        } catch (error) {
            console.error("Changing phone. Error occured:", error);
            RestartAnim(alertRef.current);
            setAlert({ text: "Что-то пошло не так", color: "red" });
        }
    }

    const handleClickEditButton = () => {
        if (disabled) {
            editButtonRef.current.classList.remove("disabled");
        } else {
            editButtonRef.current.classList.add("disabled");
            ChangePhone();
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
                    placeholder={_phone}
                    disabled={disabled}
                    value={phone}
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
                window.location.pathname = "/";
            } else setAlert({ text: "Попробуйте позже", color: "red" });
        } catch (error) {
            console.error("Changing email. Error occured:", error);
            RestartAnim(alertRef.current);
            setAlert({ text: "Что-то пошло не так", color: "red" });
        }
    }

    const handleClickEditButton = () => {
        if (disabled) {
            editButtonRef.current.classList.remove("disabled");
        } else {
            editButtonRef.current.classList.add("disabled");
            ChangeEmail();
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
            setAlert({ text: "Что-то пошло не так", color: "red" });
        }
    }

    const handleClickEditButton = () => {
        if (disabled) {
            editButtonRef.current.classList.remove("disabled");
        } else {
            editButtonRef.current.classList.add("disabled");
            ChangePassword();
        }
        setDisabled((prev) => !prev);
    };

    return (
        <div className="account-field">
            <h6>Пароль</h6>
            <div style={{ position: "relative" }}>
                <input
                    className="account-edit-input"
                    type="current-password"
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
                    type="new-password"
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            )}
        </div>
    );
}

function PostedPetsCard() {
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
                setAlert({ text: "Попробуйте позже", color: "red" });
            }
        } catch (error) {
            console.error("Getting my ads. Error occured:", error);
            RestartAnim(alertRef.current);
            setAlert({ text: "Что-то пошло не так", color: "red" });
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
