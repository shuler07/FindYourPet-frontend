import "./AdPage.css";

import { useContext, useState } from "react";
import { AppContext } from "../App";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { AD_INFO_DICT } from "../data";
import {
    ymapsInitPromise,
    YMap,
    YMapDefaultFeaturesLayer,
    YMapDefaultSchemeLayer,
    YMapMarker,
} from "../ymaps";

export default function AdPage() {
    // const ad = useContext(AppContext).ad;
    const ad = {
        status: "lost", // ONLY lost / found
        type: "dog", // ONLY dog / cat
        breed: "metis", // ONLY labrador, german_shepherd, poodle, metis etc
        color: "Черно-белый", // pet color
        size: "big", // ONLY little / medium / big
        distincts: "", // distinctive features (unneccessary)
        nickname: "Бобик", // pet nickname (unneccessary)
        danger: "unknown", // ONLY danger / safe / unknown
        location: "Москва, Константина Царева, д. 12", // place in words
        geoLocation: [37.501234, 54.234567], // place in coords
        time: "24.11.2025 12:00", // time in dd.MM.yyyy hh:mm:ss
        contactName: "Петр", // contact name of creator
        contactPhone: "+71234567890", // contact phone of creator
        contactEmail: "vitalisobolevggg@gmail.com", // contact email of creator
        extras: "Очень сильно напуган", // extra information from creator (unneccessary)
    };

    const isCreator =
        ad.contactEmail == window.localStorage.getItem("user_email");

    return (
        <>
            <Header />
            <div className="page-container">
                <div id="ad-details-container">
                    <PetPhotos />
                    <PetInfo
                        status={ad.status}
                        type={ad.type}
                        breed={ad.breed}
                        color={ad.color}
                        size={ad.size}
                        distincts={ad.distincts}
                        nickname={ad.nickname}
                        danger={ad.danger}
                        location={ad.location}
                        time={ad.time}
                        extras={ad.extras}
                        isCreator={isCreator}
                    />
                    <PetContacts
                        contactName={ad.contactName}
                        contactPhone={ad.contactPhone}
                        contactEmail={ad.contactEmail}
                    />
                    <PetPlace
                        location={ad.location}
                        geoLocation={ad.geoLocation}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
}

function PetPhotos() {
    return (
        <section id="ad-photos" className="ad-page-section">
            <img src="/images/image-not-found.png" />
        </section>
    );
}

function PetInfo({
    status,
    type,
    breed,
    color,
    size,
    distincts,
    nickname,
    danger,
    location,
    time,
    extras,
    isCreator,
}) {
    const nicknameText = nickname != "" ? nickname : "Кличка неизвестна";
    const distinctsText = distincts != "" ? distincts : "Не указаны";
    const styledInfoStatus = {
        backgroundColor: status == "lost" ? "#f53535" : "#1fcf1f",
    };

    return (
        <section id="ad-info" className="ad-page-section">
            <div id="ad-info-status" style={styledInfoStatus}>
                <h3>{AD_INFO_DICT.status[status]}</h3>
            </div>
            <div>
                <h2>{nicknameText}</h2>
                <h6>
                    {AD_INFO_DICT.breed[breed]} • {AD_INFO_DICT.type[type]}
                </h6>
            </div>
            <div>
                <h3>Детали</h3>
                <h6>
                    <span style={{ fontWeight: "600" }}>Окрас:</span> {color}
                </h6>
                <h6>
                    <span style={{ fontWeight: "600" }}>Размер:</span>{" "}
                    {AD_INFO_DICT.size[size]}
                </h6>
                <h6>
                    <span style={{ fontWeight: "600" }}>
                        Отлчительные признаки:
                    </span>{" "}
                    {distinctsText}
                </h6>
                <h6>
                    <span style={{ fontWeight: "600" }}>Опасность:</span>{" "}
                    {AD_INFO_DICT.danger[danger]}
                </h6>
                <h6>
                    <span style={{ fontWeight: "600" }}>Место:</span> {location}
                </h6>
                <h6>
                    <span style={{ fontWeight: "600" }}>Время:</span> {time}
                </h6>
            </div>
            {extras != "" && (
                <div>
                    <h3>Дополнительная информация</h3>
                    <h6>{extras}</h6>
                </div>
            )}
            {isCreator ? (
                <h6>
                    Это созданное вами объьявление. Если оно перестало быть
                    актуальным вы можете его снять
                </h6>
            ) : (
                <h6>
                    Пожалуйста, свяжитесь с автором объявления, если вы нашли
                    потерянное животное или найденный питомец является вашим
                </h6>
            )}
            <button className={`primary-button ${isCreator && "red"}`}>
                <img
                    src={isCreator ? "/icons/remove.svg" : "/icons/message.svg"}
                />
                {isCreator ? "Снять объявление" : "Связаться"}
            </button>
        </section>
    );
}

function PetContacts({ status, contactName, contactPhone, contactEmail }) {
    const profileText =
        status == "lost" ? "Владелец питомца" : "Нашедший питомца";

    return (
        <section id="ad-contacts" className="ad-page-section">
            <div id="ad-contacts-profile">
                <img src="/images/avatar-not-found.png" />
                <div>
                    <h3>{contactName}</h3>
                    <h6 style={{ fontSize: ".8em" }}>{profileText}</h6>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: ".5rem",
                }}
            >
                <div className="ad-contacts-connect">
                    <img src="/icons/phone.svg" />
                    <h6>{contactPhone}</h6>
                </div>
                <div className="ad-contacts-connect">
                    <img src="/icons/email.svg" />
                    <h6>{contactEmail}</h6>
                </div>
            </div>
        </section>
    );
}

function PetPlace({ location, geoLocation }) {
    const [mapLoaded, setMapLoaded] = useState(false);
    ymapsInitPromise.then(() => setMapLoaded(true));

    return (
        <section id="ad-place" className="ad-page-section">
            <div>
                <h2>Локация</h2>
                <h6>
                    Последний раз животное видели здесь:{" "}
                    <span style={{ fontWeight: "600" }}>{location}</span>
                </h6>
            </div>
            <div id="ad-place-map">
                {mapLoaded && (
                    <YMap location={{ center: geoLocation, zoom: 9 }}>
                        <YMapDefaultSchemeLayer />
                        <YMapDefaultFeaturesLayer />
                        <YMapMarker coordinates={geoLocation}>
                            <div className="map-marker" />
                        </YMapMarker>
                    </YMap>
                )}
            </div>
        </section>
    );
}
