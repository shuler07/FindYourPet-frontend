import "./SearchAdsPage.css";

import { useEffect, useRef, useState } from "react";

import Footer from "../components/Footer";
import Header from "../components/Header";

import { AD_INFO_DICT, AD_FILTERS_DICT, API_PATHS, DEBUG } from "../data";

export default function SearchAdsPage() {
    // Ads
    const [ads, setAds] = useState([]);

    // Search
    const [searchText, setSearchText] = useState("");
    useEffect(() => {
        const timeout = setTimeout(GetAds, 500);
        return () => clearTimeout(timeout);
    }, [searchText]);

    // Filters
    const [activeFilters, setActiveFilters] = useState({
        status: "any",
        type: "any",
        breed: "any",
        size: "any",
        danger: "any",
    });
    useEffect(() => {
        GetAds();
        setApplyFiltersDisabled(true);
    }, [activeFilters]);

    const [changedFilters, setChangedFilters] = useState({ ...activeFilters });
    useEffect(() => {
        const actFilt = Object.values(activeFilters);
        const chngFilt = Object.values(changedFilters);

        let flag = true;
        for (let i = 0; i < actFilt.length; i++) {
            if (actFilt[i] != chngFilt[i]) {
                flag = false;
                break;
            }
        }

        setApplyFiltersDisabled(flag);
    }, [changedFilters]);

    const [applyFiltersDisabled, setApplyFiltersDisabled] = useState(true);

    async function GetAds() {
        try {
            const filters = Object.fromEntries(
                Object.entries(activeFilters).filter(([_, v]) => v != "any")
            );

            // const response = await fetch(API_PATHS.get_ads, {
            //     method: "GET",
            //     body: JSON.stringify(filters),
            //     headers: { "Content-Type": "application/json" },
            // });

            // const data = await response.json();
            // if (DEBUG) console.debug("Getting ads. Data received:", data);

            const tempAds = [
                {
                    status: "lost",
                    type: "dog",
                    breed: "labrador",
                    color: "Черно-серый",
                    size: "medium",
                    distincts: "Ошейник",
                    nickname: "Келли",
                    danger: "safe",
                    location: "Москва, Волоколамское шоссе, д. 4",
                    geoLocation: "52.234212 34.531232",
                    time: "05.11.2025 12:00",
                    contactName: "Иванов Иван",
                    contactPhone: "89123456789",
                    contactEmail: "ivanovivan@pochta.ru",
                    extras: null,
                },
                {
                    status: "found",
                    type: "cat",
                    breed: "metis",
                    color: "Белый",
                    size: "little",
                    distincts: null,
                    nickname: null,
                    danger: "safe",
                    location: "Москва, Волоколамское шоссе, д. 5",
                    geoLocation: "52.234312 34.531214",
                    time: "04.11.2025 14:00",
                    contactName: "Иванов Иван",
                    contactPhone: "89123456789",
                    contactEmail: "ivanovivan@pochta.ru",
                    extras: "Свяжитесь в telegram: @ivanovivantelegram, на звонки могу не отвечать",
                },
                {
                    status: "found",
                    type: "cat",
                    breed: "metis",
                    color: "Белый",
                    size: "little",
                    distincts: null,
                    nickname: null,
                    danger: "safe",
                    location: "Москва, Волоколамское шоссе, д. 5",
                    geoLocation: "52.234312 34.531214",
                    time: "04.11.2025 14:00",
                    contactName: "Иванов Иван",
                    contactPhone: "89123456789",
                    contactEmail: "ivanovivan@pochta.ru",
                    extras: "Свяжитесь в telegram: @ivanovivantelegram, на звонки могу не отвечать",
                },
            ];
            const data = tempAds.filter((v) => {
                if (
                    Object.hasOwn(filters, "status") &&
                    v.status != filters.status
                ) {
                    return false;
                } else if (
                    Object.hasOwn(filters, "type") &&
                    v.type != filters.type
                ) {
                    return false;
                } else if (
                    Object.hasOwn(filters, "breed") &&
                    v.breed != filters.breed
                ) {
                    return false;
                } else if (
                    Object.hasOwn(filters, "size") &&
                    v.size != filters.size
                ) {
                    return false;
                } else if (
                    Object.hasOwn(filters, "danger") &&
                    v.danger != filters.danger
                ) {
                    return false;
                }

                if (
                    AD_INFO_DICT.status[v.status]
                        .toLowerCase()
                        .includes(searchText) ||
                    AD_INFO_DICT.type[v.type]
                        .toLowerCase()
                        .includes(searchText) ||
                    AD_INFO_DICT.breed[v.breed]
                        .toLowerCase()
                        .includes(searchText) ||
                    AD_INFO_DICT.size[v.size]
                        .toLowerCase()
                        .includes(searchText) ||
                    AD_INFO_DICT.danger[v.danger]
                        .toLowerCase()
                        .includes(searchText)
                )
                    return true;

                return false;
            });
            setAds(data);
        } catch (error) {
            console.error("Getting ads. Error:", error);
        }
    }

    return (
        <>
            <Header />
            <div className="page-container" style={{ alignItems: "end" }}>
                <SideBar
                    setActiveFilters={setActiveFilters}
                    changedFilters={changedFilters}
                    setChangedFilters={setChangedFilters}
                    applyFiltersDisabled={applyFiltersDisabled}
                />
                <MainContainer
                    searchText={searchText}
                    setSearchText={setSearchText}
                    ads={ads}
                />
            </div>
            <Footer />
        </>
    );
}

function SideBar({
    setActiveFilters,
    changedFilters,
    setChangedFilters,
    applyFiltersDisabled,
}) {
    const showElems = () => {
        return Object.entries(changedFilters).map((value, index) => (
            <SideBarElement
                key={`keySidebarElement${index}`}
                type={value[0]}
                value={value[1]}
                event={setChangedFilters}
            />
        ));
    };

    return (
        <div id="search-sidebar">
            <h3>Фильтры</h3>
            {showElems()}
            <button
                disabled={applyFiltersDisabled}
                className="primary-button"
                onClick={() => setActiveFilters({ ...changedFilters })}
            >
                Применить
            </button>
        </div>
    );
}

function SideBarElement({ type, value, event }) {
    const selectRef = useRef();

    const showOptions = () => {
        return Object.entries(AD_INFO_DICT[type]).map((value, index) => (
            <option key={`keyOption${type}${index}`} value={value[0]}>
                {value[1]}
            </option>
        ));
    };

    const handleChangeSelect = () => {
        event((prev) => ({ ...prev, [type]: selectRef.current.value }));
    };

    return (
        <div className="sidebar-element">
            <label htmlFor={`${type}-${value}`}>{AD_FILTERS_DICT[type]}</label>
            <div>
                <select
                    id={`${type}-${value}`}
                    className="sidebar-element-select"
                    ref={selectRef}
                    value={value}
                    onChange={handleChangeSelect}
                >
                    {showOptions()}
                </select>
            </div>
        </div>
    );
}

function MainContainer({ searchText, setSearchText, ads }) {
    const showAds = () => {
        return ads.map((value, index) => (
            <AdCard key={`keyAdCard${index}`} {...value} />
        ));
    };

    return (
        <div id="search-container">
            <SearchBar value={searchText} event={setSearchText} />
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1rem",
                }}
            >
                {showAds()}
            </div>
        </div>
    );
}

function SearchBar({ value, event }) {
    return (
        <div id="search-bar">
            <img src="/icons/search.svg" />
            <input
                id="search-field"
                type="text"
                placeholder="Поиск животного"
                value={value}
                onChange={(e) => event(e.target.value.toLowerCase())}
            />
        </div>
    );
}

function AdCard({
    status,
    type,
    breed,
    color,
    size,
    distincts,
    nickname,
    danger,
    location,
    geoLocation,
    time,
    contactName,
    contactPhone,
    contactEmail,
    extras,
}) {
    const title = nickname ? nickname : "Кличка неизвестна";
    const subtitle = `${AD_INFO_DICT.type[type]} • ${AD_INFO_DICT.breed[breed]}`;
    const description = `Окрас: ${color}, размер: ${AD_INFO_DICT.size[size]}`;
    const distinctiveFeatures = distincts
        ? `Отличительные признаки: ${distincts}`
        : "Отличительные признаки не указаны";
    const placeAndTimeData = `${location}, ${time}`;

    return (
        <div className="ad-card">
            <img src="/images/image-not-found.png" />
            <div
                className="ad-card-status"
                style={{ background: status == "lost" ? "#f53535" : "#1fcf1f" }}
            >
                <h3>{AD_INFO_DICT.status[status]}</h3>
            </div>
            <div className="ad-card-info-block">
                <h3>{title}</h3>
                <h6>{subtitle}</h6>
                <h6>{description}</h6>
                <h6>{distinctiveFeatures}</h6>
                <h6>{AD_INFO_DICT.danger[danger]}</h6>
                <h6>{placeAndTimeData}</h6>
            </div>
            <button className="primary-button gradient-primary">
                Подробнее
                <img src="/icons/right-arrow.svg" />
            </button>
        </div>
    );
}
