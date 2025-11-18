import "./SearchAdsPage.css";

import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../App";

import Footer from "../components/Footer";
import Header from "../components/Header";
import AdsContainer from "../components/AdsContainer";

import { AD_INFO_DICT, AD_FILTERS_DICT, API_PATHS, DEBUG } from "../data";
import {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker,
    YMapListener,
} from "../ymaps";
import { RestartAnim } from "../functions";

export default function SearchAdsPage() {
    // Alert
    const { setAlert, alertRef } = useContext(AppContext);

    // Ads
    const [ads, setAds] = useState([]);
    useEffect(() => {
        GetAds();
    }, []);

    // Search
    const [searchText, setSearchText] = useState("");
    useEffect(() => {
        if (searchText == "") return;

        const timeout = setTimeout(FilterAds, 500);
        return () => clearTimeout(timeout);
    }, [searchText]);

    // Filters
    const [activeFilters, setActiveFilters] = useState({
        status: "any",
        type: "any",
        breed: "any",
        size: "any",
        danger: "any",
        region: "any",
        geoloc: null,
        radius: 1,
    });

    // Sidebar
    const [placeSection, setPlaceSection] = useState("region");
    const [mobileView, setMobileView] = useState(window.innerWidth <= 768);

    window.addEventListener(
        "resize",
        () => {
            if (window.innerWidth <= 768 && !mobileView) setMobileView(true);
            else if (window.innerWidth > 768 && mobileView)
                setMobileView(false);
        },
        [mobileView]
    );

    const [sidebarOpened, setSidebarOpened] = useState(false);

    // Geoloc
    const [geolocOpened, setGeolocOpened] = useState(false);

    async function GetAds() {
        try {
            const filters = Object.fromEntries(
                Object.entries(activeFilters).filter(
                    ([k, v]) => v != "any" && !["geoloc", "radius"].includes(k)
                )
            );

            if (placeSection == "place") {
                delete filters.region;
                filters.geoloc = activeFilters.geoloc;
                filters.radius = activeFilters.radius;
            }

            console.log(filters);

            const response = await fetch(API_PATHS.get_ads, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(filters),
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (DEBUG) console.debug("Getting ads. Data received:", data);

            if (data.success) setAds(data.ads);
            else {
                RestartAnim(alertRef.current);
                setAlert({ text: "Попробуйте позже", color: "red" });
            }
        } catch (error) {
            console.error("Getting ads. Error:", error);
            RestartAnim(alertRef.current);
            setAlert({ text: "Что-то пошло не так", color: "red" });
        }
    }

    function FilterAds() {
        const getSimilarity = (word, text) => {
            let wordInd = 0,
                maxCnt = 0;
            for (let i = 0; i < text.length; i++) {
                if (text[i] == word[wordInd]) {
                    wordInd++;
                    maxCnt = wordInd > maxCnt ? wordInd : maxCnt;
                } else wordInd = 0;
            }
            console.log('res:', maxCnt / word.length);
            return maxCnt / word.length;
        };

        const words = searchText.split(" ");
        const toCheck = [
            "type",
            "breed",
            "size",
            "danger",
            "color",
            "distincts",
            "nickname",
            "extras",
        ];

        setAds((prev) =>
            prev.filter((ad) => {
                let flag = false;
                for (let i = 0; i < words.length; i++) {
                    for (let j = 0; j < toCheck.length; j++) {
                        if (getSimilarity(words[i], ad[toCheck[j]]) > 0.6) {
                            flag = true;
                            break;
                        };
                    };
                    if (flag) break;
                };
                return flag;
            })
        );
    }

    return (
        <>
            <Header />
            <div className="page-container" id="search-ads-page-container">
                <SideBar
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    getAds={GetAds}
                    sidebarOpened={mobileView ? sidebarOpened : true}
                    setGeolocOpened={setGeolocOpened}
                    placeSection={placeSection}
                    setPlaceSection={setPlaceSection}
                />
                <MainContainer
                    searchText={searchText}
                    setSearchText={setSearchText}
                    ads={ads}
                    mobileView={mobileView}
                    setSidebarOpened={setSidebarOpened}
                />
            </div>
            {geolocOpened && (
                <GeolocSelection
                    location={activeFilters.geoloc}
                    setGeolocOpened={setGeolocOpened}
                    setActiveFilters={setActiveFilters}
                />
            )}
            <Footer />
        </>
    );
}

function SideBar({
    activeFilters,
    setActiveFilters,
    getAds,
    sidebarOpened,
    setGeolocOpened,
    placeSection,
    setPlaceSection,
}) {
    const showElems = () => {
        return Object.entries(activeFilters).map((value, index) => {
            if (!["region", "geoloc", "radius"].includes(value[0])) {
                return (
                    <SideBarElement
                        key={`keySidebarElement${index}`}
                        type={value[0]}
                        value={value[1]}
                        event={setActiveFilters}
                    />
                );
            }
        });
    };

    const handleChangeRadius = (e) => {
        setActiveFilters((prev) => ({ ...prev, radius: e.target.value }));
    };

    return (
        <div
            id="search-sidebar"
            style={{ display: sidebarOpened ? "flex" : "none" }}
        >
            <h3>Фильтры</h3>
            {showElems()}
            <div
                id="switch-sidebar-place-section"
                onClick={() =>
                    setPlaceSection((prev) =>
                        prev == "region" ? "place" : "region"
                    )
                }
            >
                <div
                    id="switch-sidebar-place-section-active"
                    className={placeSection == "place" ? "place" : ""}
                />
                <div className="switch-sidebar-place-section-element">
                    <h6>Регион</h6>
                </div>
                <div className="switch-sidebar-place-section-element">
                    <h6>Карта</h6>
                </div>
            </div>
            {placeSection == "region" ? (
                <SideBarElement
                    type="region"
                    value={activeFilters.region}
                    event={setActiveFilters}
                />
            ) : (
                <>
                    <div className="sidebar-element">
                        <label>Точка</label>
                        <div
                            className="sidebar-element-field"
                            style={{ width: "calc(100% - 2rem)" }}
                            onClick={() => setGeolocOpened(true)}
                        >
                            {activeFilters.geoloc
                                ? `${activeFilters.geoloc[0].toFixed(
                                      4
                                  )} ${activeFilters.geoloc[1].toFixed(4)}`
                                : "Не выбрана"}
                        </div>
                    </div>
                    <div className="sidebar-element">
                        <label>Радиус поиска {"(км)"}</label>
                        <input
                            className="sidebar-element-field"
                            style={{
                                width: "calc(100% - 2rem)",
                                cursor: "text",
                            }}
                            type="number"
                            placeholder="Не менее 1"
                            value={activeFilters.radius}
                            onChange={handleChangeRadius}
                        />
                    </div>
                </>
            )}
            <button
                disabled={
                    placeSection == "place" &&
                    (!activeFilters.geoloc || activeFilters.radius < 1)
                }
                className="primary-button left-img"
                onClick={getAds}
            >
                <img src="/icons/search.svg" />
                Поиск
            </button>
        </div>
    );
}

function SideBarElement({ type, value, event }) {
    const showOptions = () => {
        return Object.entries(AD_INFO_DICT[type]).map((value, index) => (
            <option key={`keyOption${type}${index}`} value={value[0]}>
                {value[1]}
            </option>
        ));
    };

    const handleChangeSelect = (e) => {
        event((prev) => ({ ...prev, [type]: e.target.value }));
    };

    return (
        <div className="sidebar-element">
            <label htmlFor={`${type}-${value}`}>{AD_FILTERS_DICT[type]}</label>
            <div>
                <select
                    id={`${type}-${value}`}
                    className="sidebar-element-field"
                    value={value}
                    onChange={handleChangeSelect}
                >
                    {showOptions()}
                </select>
            </div>
        </div>
    );
}

function MainContainer({
    searchText,
    setSearchText,
    ads,
    mobileView,
    setSidebarOpened,
}) {
    return (
        <div id="search-container">
            <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
                <SearchBar value={searchText} event={setSearchText} />
                {mobileView && (
                    <div
                        id="switch-sidebar"
                        onClick={() => setSidebarOpened((prev) => !prev)}
                    >
                        <img src="/icons/filter.svg" />
                    </div>
                )}
            </div>
            <AdsContainer ads={ads} />
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

function GeolocSelection({ location, setGeolocOpened, setActiveFilters }) {
    const mapRef = useRef();

    const [mapLocation, setMapLocation] = useState(
        location ? location : [37.617644, 55.755819]
    );
    const [mapZoom, setMapZoom] = useState(9);

    const [geopoint, setGeopoint] = useState(location);

    const handleClickMap = (e) => {
        if (!e?.entity) return;

        setMapLocation(e.center);
        setMapZoom(e.zoom);
        setGeopoint(e.entity.geometry.coordinates);
    };

    const handleClickApply = () => {
        setActiveFilters((prev) => ({
            ...prev,
            geoloc: geopoint,
        }));
        setGeolocOpened(false);
    };

    return (
        <div id="geoloc-container">
            <div id="search-ads-map">
                <YMap
                    location={{ center: mapLocation, zoom: mapZoom }}
                    style={{ width: "100%", height: "100%" }}
                    ref={mapRef}
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
            <div id="geoloc-window">
                <button
                    id="geoloc-button-back"
                    className="primary-button geoloc-button"
                    onClick={() => setGeolocOpened(false)}
                >
                    <img src="/icons/left-arrow.svg" />
                    Вернуться
                </button>
                <div id="geoloc-center-window">
                    <h3>Выберите место на карте</h3>
                </div>
                <button
                    disabled={!geopoint}
                    className="primary-button geoloc-button"
                    onClick={handleClickApply}
                >
                    Применить
                    <img src="/icons/right-arrow.svg" />
                </button>
            </div>
        </div>
    );
}
