import "./CreateAdPage.css";

import { useRef, useState, useContext, useEffect } from "react";
import { AppContext } from "../App";

import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import DropdownLabeled from "../components/DropdownLabeled";
import InputLabeled from "../components/InputLabeled";

import { API_PATHS, CREATE_AD_STAGES, DEBUG } from "../data";
import {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker,
    YMapListener,
} from "../ymaps";
import { RestartAnim } from "../functions";

export default function CreateAdPage() {
    const [activeStage, setActiveStage] = useState(0);

    const validateFieldsFunc = useRef(() => {});
    const applyFieldsFunc = useRef(() => {});
    const adDetails = useRef({
        status: "", // ONLY lost / found
        type: "", // ONLY dog / cat
        breed: "", // ONLY labrador, german_shepherd, poodle, metis etc
        color: "", // pet color
        size: "", // ONLY little / medium / big
        distincts: "", // distinctive features (unneccessary)
        nickname: "", // pet nickname (unneccessary)
        danger: "", // ONLY danger / safe / unknown
        location: "", // place in words
        geoLocation: null, // place in coords
        time: "", // time in dd.MM.yyyy hh:mm:ss
        contactName: "", // contact name of creator
        contactPhone: "", // contact phone of creator
        contactEmail: "", // contact email of creator
        extras: "", // extra information from creator (unneccessary)
    });

    const { setAlert, alertRef } = useContext(AppContext);

    const ProcessNavigationButtonClick = async (delta) => {
        if (delta == -1) {
            setActiveStage((prev) => prev - 1);
            return;
        }

        if (!validateFieldsFunc.current()) {
            RestartAnim(alertRef.current);
            setAlert({ text: "Заполните обязательные поля", color: "red" });
            return;
        }

        if (activeStage != 3) {
            await applyFieldsFunc.current();
            setActiveStage((prev) => prev + 1);
        } else CreateAd();
    };

    async function CreateAd() {
        try {
            const response = await fetch(API_PATHS.create_ad, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(adDetails.current),
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (DEBUG) console.debug("Creating ad. Data received:", data);

            RestartAnim(alertRef.current);
            if (data.success)
                setAlert({
                    text: "Объявление успешно создано",
                    color: "green",
                });
            else setAlert({ text: "Попробуйте позже", color: "red" });
        } catch (error) {
            console.error("Creating ad. Error occured:", error);
            setAlert({ text: "Что-то пошло не так", color: "red" });
        }
    }

    return (
        <>
            <Header />
            <div className="page-container" style={{ justifyContent: "start" }}>
                <div id="ad-container">
                    <h2>Создание объявления</h2>
                    <StagesContainer activeStage={activeStage} />
                    <FieldsContainer
                        activeStage={activeStage}
                        validateFieldsFunc={validateFieldsFunc}
                        applyFieldsFunc={applyFieldsFunc}
                        adDetails={adDetails}
                    />
                    <StageNavigationContainer
                        backDisabled={activeStage == 0}
                        lastRenamed={activeStage == 3}
                        processNavigationButtonClick={
                            ProcessNavigationButtonClick
                        }
                    />
                </div>
            </div>
            <Footer />
        </>
    );
}

function StagesContainer({ activeStage }) {
    return (
        <div id="stages-container">
            {CREATE_AD_STAGES.map((value, index) => {
                let status = "";
                if (index < activeStage) status = "done";
                else if (index == activeStage) status = "active";
                return (
                    <Stage
                        key={`keyStage${index}`}
                        name={value}
                        status={status}
                    />
                );
            })}
        </div>
    );
}

function Stage({ name, status }) {
    return (
        <div className="stage">
            <h6 className={status}>{name}</h6>
            <div className={status} />
        </div>
    );
}

function FieldsContainer({
    activeStage,
    validateFieldsFunc,
    applyFieldsFunc,
    adDetails,
}) {
    switch (activeStage) {
        case 0:
            return (
                <MainInformationFields
                    validate={validateFieldsFunc}
                    apply={applyFieldsFunc}
                    adDetails={adDetails}
                />
            );
        case 1:
            return (
                <PetInformationFields
                    validate={validateFieldsFunc}
                    apply={applyFieldsFunc}
                    adDetails={adDetails}
                />
            );
        case 2:
            return (
                <LocationFields
                    validate={validateFieldsFunc}
                    apply={applyFieldsFunc}
                    adDetails={adDetails}
                />
            );
        case 3:
            return (
                <ContactFields
                    validate={validateFieldsFunc}
                    apply={applyFieldsFunc}
                    adDetails={adDetails}
                />
            );
    }
}

function MainInformationFields({ validate, apply, adDetails }) {
    const refs = { status: useRef() };

    validate.current = () => {
        Object.values(refs).forEach((ref) => {
            if (ref.current.value == "") {
                ref.current.classList.add("wrong-field");
                return false;
            }
        });
        return true;
    };

    apply.current = () => {
        adDetails.current = {
            ...adDetails.current,
            status: refs.status.current.value,
        };
    };

    return (
        <div id="fields-container">
            <DropdownLabeled
                dropdownId="PetLostFound"
                label="Потеряли или нашли животное? *"
                choices={[
                    ["lost", "Потеряли"],
                    ["found", "Нашли"],
                ]}
                ref={refs.status}
                value={adDetails.current.status}
            />
        </div>
    );
}

function PetInformationFields({ validate, apply, adDetails }) {
    const refs = {
        type: useRef(),
        breed: useRef(),
        color: useRef(),
        size: useRef(),
        distincts: useRef(),
        nickname: useRef(),
        danger: useRef(),
    };

    validate.current = () => {
        let flag = true;

        Object.entries(refs).forEach((value) => {
            if (!["distincts", "nickname"].includes(value[0])) {
                const elem = value[1].current;
                if (elem.value == "") {
                    elem.classList.add("wrong-field");
                    flag = false;
                } else elem.classList.remove("wrong-field");
            }
        });

        return flag;
    };

    apply.current = () => {
        adDetails.current = {
            ...adDetails.current,
            type: refs.type.current.value,
            breed: refs.breed.current.value,
            color: refs.color.current.value,
            size: refs.size.current.value,
            distincts: refs.distincts.current.value,
            nickname: refs.nickname.current.value,
            danger: refs.danger.current.value,
        };
    };

    return (
        <div id="fields-container">
            <DropdownLabeled
                dropdownId="PetType"
                label="Тип животного *"
                choices={[
                    ["dog", "Собака"],
                    ["cat", "Кошка"],
                ]}
                ref={refs.type}
                value={adDetails.current.type}
            />
            <DropdownLabeled
                dropdownId="PetBreed"
                label="Порода *"
                choices={[
                    ["labrador", "Лабрадор"],
                    ["german_shepherd", "Немецкая овчарка"],
                    ["poodle", "Пудель"],
                    ["metis", "Метис"],
                ]}
                ref={refs.breed}
                value={adDetails.current.breed}
            />
            <InputLabeled
                inputId="PetColor"
                type="text"
                placeholder="Рыжий, черный, серый с черными пятнами"
                autoComplete="off"
                label="Окрас *"
                ref={refs.color}
                value={adDetails.current.color}
            />
            <DropdownLabeled
                dropdownId="PetSize"
                label="Размер *"
                choices={[
                    ["little", "Маленький"],
                    ["medium", "Средний"],
                    ["big", "Крупный"],
                ]}
                ref={refs.size}
                value={adDetails.current.size}
            />
            <InputLabeled
                inputId="PetDistincts"
                type="text"
                placeholder="Шрамы, ошейник, бирка, особые признаки"
                autoComplete="off"
                label="Отличительные признаки"
                ref={refs.distincts}
                value={adDetails.current.distincts}
            />
            <InputLabeled
                inputId="PetNickname"
                type="text"
                placeholder=""
                autoComplete="off"
                label="Кличка"
                ref={refs.nickname}
                value={adDetails.current.nickname}
            />
            <DropdownLabeled
                dropdownId="PetDanger"
                label="Животное может быть опасным для окружающих? *"
                choices={[
                    ["danger", "Да"],
                    ["safe", "Нет"],
                    ["unknown", "Не знаю"],
                ]}
                ref={refs.danger}
                value={adDetails.current.danger}
            />
        </div>
    );
}

function LocationFields({ validate, apply, adDetails }) {
    const refs = {
        location: useRef(),
        map: useRef(),
        time: useRef(),
    };
    const [geopoint, setGeopoint] = useState(adDetails.current.geoLocation);

    const [placeSelection, setPlaceSelection] = useState("write");

    validate.current = () => {
        let flag = true;

        if (refs.time.current.value == "") {
            refs.time.current.classList.add("wrong-field");
            flag = false;
        } else refs.time.current.classList.remove("wrong-field");

        if (placeSelection == "write") {
            if (refs.location.current.value == "") {
                refs.location.current.classList.add("wrong-field");
                flag = false;
            } else refs.location.current.classList.remove("wrong-field");
        } else {
            if (!geopoint) {
                refs.map.current.classList.add("wrong-field");
                flag = false;
            } else refs.map.current.classList.remove("wrong-field");
        }

        return flag;
    };

    apply.current = async () => {
        if (placeSelection == "write") {
            async function getGeolocation() {
                try {
                    const response = await fetch(
                        `https://geocode-maps.yandex.ru/v1/?apikey=${
                            import.meta.env.VITE_YMAPS_API_KEY
                        }&geocode=${refs.location.current.value.replaceAll(
                            " ",
                            "+"
                        )}&format=json`
                    );

                    const data = await response.json();

                    if (DEBUG)
                        console.debug(
                            "Getting geolocation. Data received:",
                            data
                        );

                    return data;
                } catch (error) {
                    console.error("Getting geolocation. Error:", error);
                }
            }

            const data = await getGeolocation();

            try {
                const geoLocation =
                    data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                        " "
                    );

                if (DEBUG) {
                    console.debug(
                        "Resolving geolocation. Data received:",
                        geoLocation
                    );
                }

                adDetails.current = {
                    ...adDetails.current,
                    location: refs.location.current.value,
                    geoLocation: geoLocation,
                    time: refs.time.current.value,
                };
            } catch (error) {
                console.error("Resolving geolocation. Error:", error);

                adDetails.current = {
                    ...adDetails.current,
                    location: refs.location.current.value,
                    geoLocation: null,
                    time: refs.time.current.value,
                };
            }
        } else {
            async function getAddress() {
                try {
                    const response = await fetch(
                        `https://geocode-maps.yandex.ru/v1/?apikey=${
                            import.meta.env.VITE_YMAPS_API_KEY
                        }&geocode=${geopoint}&format=json`
                    );

                    const data = await response.json();

                    if (DEBUG)
                        console.debug("Getting address. Data received:", data);

                    return data;
                } catch (error) {
                    console.error("Getting address. Error:", error);
                }
            }

            const data = await getAddress();

            try {
                const address =
                    data.response.GeoObjectCollection.featureMember[0].GeoObject
                        .Point.pos;

                if (DEBUG) {
                    console.debug("Resolving address. Data received:", address);
                }

                adDetails.current = {
                    ...adDetails.current,
                    location: address,
                    geoLocation: geopoint,
                    time: refs.time.current.value,
                };
            } catch (error) {
                console.error("Resolving geolocation. Error:", error);

                adDetails.current = {
                    ...adDetails.current,
                    location: null,
                    geoLocation: geopoint,
                    time: refs.time.current.value,
                };
            }
        }
    };

    return (
        <div id="fields-container">
            <div id="fields-select-place">
                <label>Где вы последний раз видели животное? *</label>
                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                    }}
                >
                    <button
                        disabled={placeSelection == "write"}
                        className="primary-button"
                        onClick={() => setPlaceSelection("write")}
                    >
                        Написать
                    </button>
                    <h3>или</h3>
                    <button
                        disabled={placeSelection == "map"}
                        className="primary-button"
                        onClick={() => setPlaceSelection("map")}
                    >
                        Указать на карте
                    </button>
                </div>
            </div>
            {placeSelection &&
                (placeSelection == "write" ? (
                    <InputAddress
                        value={adDetails.current.location}
                        ref={refs.location}
                    />
                ) : (
                    <InputMap
                        geopoint={geopoint}
                        setGeopoint={setGeopoint}
                        ref={refs.map}
                    />
                ))}
            <InputLabeled
                inputId="PetTime"
                type="text"
                placeholder="дд.ММ.гггг чч:мм"
                label="Когда вы потеряли или нашли животное? *"
                ref={refs.time}
                value={adDetails.current.time}
            />
        </div>
    );
}

function InputAddress({ value, ref }) {
    const [text, setText] = useState(value);
    useEffect(() => {
        if (text.length <= 3) return;

        const handler = setTimeout(() => {
            async function getResponse() {
                try {
                    const response = await fetch(
                        `https://suggest-maps.yandex.ru/v1/suggest?apikey=${
                            import.meta.env.VITE_YMAPS_GEOSUGGEST_API_KEY
                        }&text=${text}&results=5`
                    );

                    const data = await response.json();

                    if (DEBUG)
                        console.log(
                            "Searching addresses. Data received:",
                            data
                        );
                } catch (error) {
                    console.error("Searching addresses. Error:", error);
                }
            }

            getResponse();
        }, 2000);

        return () => clearTimeout(handler);
    }, [text]);

    return (
        <input
            id="input-address"
            type="text"
            placeholder="Город, район, улица, поселок, место"
            value={text}
            onChange={(e) => setText(e.target.value)}
            ref={ref}
        />
    );
}

function InputMap({ geopoint, setGeopoint, ref }) {
    const [mapLocation, setMapLocation] = useState(
        geopoint ? geopoint : [37.617644, 55.755819]
    );
    const [mapZoom, setMapZoom] = useState(9);

    const handleClickMap = (e) => {
        if (!e?.entity) return;

        setMapLocation(e.center);
        setMapZoom(e.zoom);
        setGeopoint(e.entity.geometry.coordinates);
    };

    return (
        <div id="create-ad-map" ref={ref}>
            <YMap
                location={{ center: mapLocation, zoom: mapZoom }}
                style={{ width: "100%", height: "100%" }}
            >
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                {geopoint && (
                    <YMapMarker coordinates={geopoint}>
                        <div className="map-marker" />
                    </YMapMarker>
                )}
                <YMapListener onClick={handleClickMap} />
            </YMap>
        </div>
    );
}

function ContactFields({ validate, apply, adDetails }) {
    const refs = {
        contactName: useRef(),
        contactPhone: useRef(),
        contactEmail: useRef(),
        extras: useRef(),
    };

    validate.current = () => {
        let flag = true;

        Object.entries(refs).forEach((value) => {
            if (value[0] != "extras") {
                const elem = value[1].current;
                if (elem.value == "") {
                    elem.classList.add("wrong-field");
                    flag = false;
                } else elem.classList.remove("wrong-field");
            }
        });

        return flag;
    };

    apply.current = () => {
        adDetails.current = {
            ...adDetails.current,
            contactName: refs.contactName.current.value,
            contactPhone: refs.contactPhone.current.value,
            contactEmail: refs.contactEmail.current.value,
            extras: refs.extras.current.value,
        };
    };

    return (
        <div id="fields-container">
            <InputLabeled
                inputId="PetContactName"
                type="text"
                placeholder="Имя"
                autoComplete="off"
                label="Ваше имя *"
                ref={refs.contactName}
                value={adDetails.current.contactName}
            />
            <InputLabeled
                inputId="PetContactPhone"
                type="tel"
                placeholder="+7(___)___-__-__"
                autoComplete="tel"
                label="Ваш телефон *"
                ref={refs.contactPhone}
                value={adDetails.current.contactPhone}
            />
            <InputLabeled
                inputId="PetContactEmail"
                type="email"
                placeholder="example@mail.com"
                autoComplete="email"
                label="Ваша электронная почта *"
                ref={refs.contactEmail}
                value={adDetails.current.contactEmail}
            />
            <InputLabeled
                inputId="PetContactExtra"
                type="text"
                placeholder="Хотите указать что-то еще?"
                autoComplete="off"
                label="Дополнительная информация"
                ref={refs.extras}
                value={adDetails.current.extras}
            />
        </div>
    );
}

function StageNavigationContainer({
    backDisabled,
    lastRenamed,
    processNavigationButtonClick,
}) {
    return (
        <div id="stage-navigation-container">
            <button
                id="prev-stage-button"
                className="primary-button left-img"
                disabled={backDisabled}
                onClick={() => processNavigationButtonClick(-1)}
            >
                <img src="/icons/left-arrow.svg" />
                Назад
            </button>
            <button
                id="next-stage-button"
                className="primary-button right-img"
                onClick={() => processNavigationButtonClick(1)}
            >
                {lastRenamed ? "Создать" : "Далее"}
                <img
                    src={
                        lastRenamed
                            ? "/icons/plus.svg"
                            : "/icons/right-arrow.svg"
                    }
                />
            </button>
        </div>
    );
}
