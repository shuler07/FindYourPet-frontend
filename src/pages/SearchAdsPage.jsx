import "./SearchAdsPage.css";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../App";

import Footer from "../components/Footer";
import Header from "../components/Header";
import AdsContainer from "../components/AdsContainer";

import { AD_INFO_DICT, AD_FILTERS_DICT, API_PATHS, DEBUG } from "../data";
import { RestartAnim } from "../functions";

export default function SearchAdsPage() {
    // Alert
    const { setAlert, alertRef } = useContext(AppContext);

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

    // Sidebar
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

    async function GetAds() {
        try {
            const filters = Object.fromEntries(
                Object.entries(activeFilters).filter(([_, v]) => v != "any")
            );

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

    return (
        <>
            <Header />
            <div className="page-container" style={{ alignItems: "end" }}>
                <SideBar
                    setActiveFilters={setActiveFilters}
                    changedFilters={changedFilters}
                    setChangedFilters={setChangedFilters}
                    applyFiltersDisabled={applyFiltersDisabled}
                    sidebarOpened={mobileView ? sidebarOpened : true}
                />
                <MainContainer
                    searchText={searchText}
                    setSearchText={setSearchText}
                    ads={ads}
                    mobileView={mobileView}
                    setSidebarOpened={setSidebarOpened}
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
    sidebarOpened,
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
        <div
            id="search-sidebar"
            style={{ display: sidebarOpened ? "flex" : "none" }}
        >
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
