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

    // Search
    const [searchText, setSearchText] = useState("");
    useEffect(() => {
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

        if (placeSection == "place") {
            if (!changedFilters.geoloc || changedFilters.radius < 1)
                flag = true;
        }

        setApplyFiltersDisabled(flag);
    }, [changedFilters]);

    const [applyFiltersDisabled, setApplyFiltersDisabled] = useState(true);

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

            const response = await fetch(API_PATHS.get_ads, {
                method: "GET",
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

    function FilterAds() {}

    return (
        <>
            <Header />
            <div className="page-container" id="search-ads-page-container">
                <SideBar
                    setActiveFilters={setActiveFilters}
                    changedFilters={changedFilters}
                    setChangedFilters={setChangedFilters}
                    applyFiltersDisabled={applyFiltersDisabled}
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
                    setChangedFilters={setChangedFilters}
                />
            )}
            <Footer />
        </>
    );
}

function SideBar({
    setActiveFilters,
    changedFilters,
    setChangedFilters,
    applyFiltersDisabled,
    sidebarOpened,
    setGeolocOpened,
    placeSection,
    setPlaceSection,
}) {
    const showElems = () => {
        return Object.entries(changedFilters).map((value, index) => {
            if (!["region", "geoloc", "radius"].includes(value[0])) {
                return (
                    <SideBarElement
                        key={`keySidebarElement${index}`}
                        type={value[0]}
                        value={value[1]}
                        event={setChangedFilters}
                    />
                );
            }
        });
    };

    const handleChangeRadius = (e) => {
        setChangedFilters((prev) => ({ ...prev, radius: e.target.value }));
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
                    value={changedFilters.region}
                    event={setChangedFilters}
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
                            {changedFilters.geoloc
                                ? `${changedFilters.geoloc[0].toFixed(
                                      4
                                  )} ${changedFilters.geoloc[1].toFixed(4)}`
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
                            value={changedFilters.radius}
                            onChange={handleChangeRadius}
                        />
                    </div>
                </>
            )}
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

function GeolocSelection({ location, setGeolocOpened, setChangedFilters }) {
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
        setChangedFilters((prev) => ({
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
