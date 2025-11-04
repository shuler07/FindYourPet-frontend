import "./SearchAdsPage.css";

import { useEffect, useRef, useState } from "react";

import Footer from "../components/Footer";
import Header from "../components/Header";

import { DROPDOWN_SECTION_VALUES, DROPDOWN_VALUES } from "../data";

export default function SearchAdsPage() {
    const [ads, setAds] = useState([]);

    const [searchText, setSearchText] = useState("");
    const [activeFilters, setActiveFilters] = useState({
        status: "lost",
        type: "dog",
        breed: "labrador",
    });
    useEffect(() => {
        GetAds();
    }, [searchText, activeFilters]);

    async function GetAds() {
        setAds((prev) => prev);
    }

    return (
        <>
            <Header />
            <div className="page-container" style={{ alignItems: "end" }}>
                <SideBar
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
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

function SideBar({ activeFilters, setActiveFilters }) {
    return (
        <div id="search-sidebar">
            {Object.entries(activeFilters).map((value, index) => (
                <SideBarElement
                    key={`keySidebarElement${index}`}
                    type={value[0]}
                    value={value[1]}
                    event={setActiveFilters}
                />
            ))}
        </div>
    );
}

function SideBarElement({ type, value, event }) {
    const selectRef = useRef();

    return (
        <div className="sidebar-element">
            <label htmlFor={`${type}-${value}`}>
                {DROPDOWN_SECTION_VALUES[type]}
            </label>
            <div>
                <select
                    id={`${type}-${value}`}
                    className="sidebar-element-select"
                    ref={selectRef}
                    value={value}
                    onChange={() =>
                        event((prev) => {
                            const curr = {
                                ...prev,
                                [type]: selectRef.current.value,
                            };
                            return curr;
                        })
                    }
                >
                    {DROPDOWN_VALUES[type].map((value, index) => (
                        <option
                            key={`keyOption${type}${index}`}
                            value={value[0]}
                        >
                            {value[1]}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

function MainContainer({ searchText, setSearchText, ads }) {
    return (
        <div id="search-container">
            <SearchBar value={searchText} event={setSearchText} />
            {ads.map((value, index) => (
                <AdCard key={`keyAdCard${index}`} {...value} />
            ))}
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
                onChange={(e) => event(e.target.value)}
            />
        </div>
    );
}

function AdCard({  }) {
    return <div className="ad-card"></div>;
}
