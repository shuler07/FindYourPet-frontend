import "./CreateAdPage.css";

import { useRef, useState, useContext, useEffect } from "react";
import { AppContext } from "../App";

import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import DropdownLabeled from "../components/DropdownLabeled";
import InputLabeled from "../components/InputLabeled";

import { CREATE_AD_STAGES, DEBUG } from "../data";
import {
    ymapsInitPromise,
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker,
    YMapListener,
} from "../ymaps";
import { ApiCreateAd } from "../apiRequests";
import { useNavigate } from "react-router-dom";

export default function CreateAdPage() {
    const navigate = useNavigate();

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
        geoLocation: [], // place in coords
        time: "", // time in dd.MM.yyyy hh:mm:ss
        contactName: "", // contact name of creator
        contactPhone: "", // contact phone of creator
        contactEmail: "", // contact email of creator
        extras: "", // extra information from creator (unneccessary)
    });

    const { CallAlert } = useContext(AppContext);

    const [navigationButtonsDisabled, setNavigationButtonsDisabled] =
        useState(false);

    const ProcessNavigationButtonClick = async (delta) => {
        if (delta == -1) {
            setActiveStage((prev) => prev - 1);
            return;
        }

        if (!validateFieldsFunc.current()) {
            CallAlert("Заполните обязательные поля", "red");
            return;
        }

        setNavigationButtonsDisabled(true);
        await applyFieldsFunc.current();
        setNavigationButtonsDisabled(false);

        if (activeStage != 3) setActiveStage((prev) => prev + 1);
        else CreateAd();
    };

    async function CreateAd() {
        setNavigationButtonsDisabled(true);

        const data = await ApiCreateAd(adDetails.current);

        setNavigationButtonsDisabled(false);

        if (data.success) {
            CallAlert("Объявление успешно создано", "green");
            navigate("/");
        } else if (data.message == "Неверный формат времени")
            CallAlert("Время указано в неверном формате", "red");
        else if (data.error)
            CallAlert(
                "Ошибка при создании объявления. Попробуйте позже",
                "red"
            );
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
                        last={activeStage == 3}
                        event={ProcessNavigationButtonClick}
                        disabled={navigationButtonsDisabled}
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
                    data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
                        .split(" ")
                        .map((coord) => parseFloat(coord));

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
                    geoLocation: [],
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
                    location: "",
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

                    if (data.results) setSuggests(data.results);
                    else setSuggests([]);
                } catch (error) {
                    console.error("Searching addresses. Error:", error);
                    setSuggests([]);
                }
            }

            getResponse();
        }, 1000);

        setTimeout(() => {
            if (text.length <= 3 || !ref.current.matches(":focus-visible")) {
                setSuggests([]);
                clearTimeout(handler);
                return;
            }
        }, 5);

        return () => clearTimeout(handler);
    }, [text]);

    const [suggests, setSuggests] = useState([]);

    const getSuggests = () => {
        return suggests.map((value, index) => {
            const title = value.title.text;
            const subtitle = value.subtitle?.text;

            let suggestText = subtitle ? subtitle : title;
            if (subtitle && title.length > subtitle.length)
                suggestText += `, ${title}`;

            const suggestStyle = {
                borderTopLeftRadius: index == 0 ? "1rem" : 0,
                borderTopRightRadius: index == 0 ? "1rem" : 0,
                borderBottomLeftRadius:
                    index == suggests.length - 1 ? "1rem" : 0,
                borderBottomRightRadius:
                    index == suggests.length - 1 ? "1rem" : 0,
            };

            return (
                <div
                    key={`keySuggest${index}`}
                    className="suggest-item"
                    style={suggestStyle}
                    onMouseDown={() => setText(suggestText)}
                >
                    {suggestText}
                </div>
            );
        });
    };

    return (
        <div>
            <input
                id="input-address"
                type="text"
                placeholder="Город, район, улица, поселок, место"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={() => setSuggests([])}
                ref={ref}
            />
            {suggests.length > 0 && (
                <div id="input-address-suggests-container">{getSuggests()}</div>
            )}
        </div>
    );
}

function InputMap({ geopoint, setGeopoint, ref }) {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapLocation, setMapLocation] = useState(
        geopoint.length != 0 ? geopoint : [37.617644, 55.755819]
    );
    const [mapZoom, setMapZoom] = useState(9);

    ymapsInitPromise.then(() => setMapLoaded(true));

    const handleClickMap = (e) => {
        if (!e?.entity) return;

        setMapLocation(e.center);
        setMapZoom(e.zoom);
        setGeopoint(e.entity.geometry.coordinates);
    };

    return (
        <div id="create-ad-map" ref={ref}>
            {mapLoaded && (
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
            )}
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

function StageNavigationContainer({ backDisabled, last, event, disabled }) {
    const nextButtonText = disabled
        ? "Ожидайте..."
        : last
        ? "Создать"
        : "Далее";
    const nextButtonIcon = last ? "/icons/plus.svg" : "/icons/right-arrow.svg";

    return (
        <div id="stage-navigation-container">
            <button
                id="prev-stage-button"
                className="primary-button left-img"
                disabled={backDisabled || disabled}
                onClick={() => event(-1)}
            >
                <img src="/icons/left-arrow.svg" />
                Назад
            </button>
            <button
                id="next-stage-button"
                className="primary-button right-img"
                disabled={disabled}
                onClick={() => event(1)}
            >
                {nextButtonText}
                <img src={nextButtonIcon} />
            </button>
        </div>
    );
}
