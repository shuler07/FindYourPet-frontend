import "./MainPage.css";

import { useRef } from "react";

import Header from "../components/Header";

export default function MainPage() {

    const headerRef = useRef();

    window.addEventListener("scroll", () => {
        if (document.documentElement.scrollTop > 20) {
            headerRef.current.classList.remove('atTheTop');
        } else {
            headerRef.current.classList.add('atTheTop');
        };
    });

    return (
        <div id="mainPageContainer">
            <Header headerRef={headerRef} />
            <section id="mainPageIntroSection" className="atTheTop">
                <h1>Find Your Pet</h1>
                <div id='mainPageIntroButtonsContainer'>
                    <button
                        className="mainPageIntroButton"
                        style={{
                            border: 'none',
                            background: "var(--primary-color)",
                        }}
                    >
                        <h2>
                            Создать объявление
                        </h2>
                    </button>
                    <button
                        className="mainPageIntroButton"
                        style={{
                            border: 'solid 3px var(--primary-color)',
                            background: "#ffffff60",
                            backdropFilter: 'blur(8px)'
                        }}
                    >
                        <h2 style={{ color: 'var(--primary-color)' }}>
                            Найти объявления
                        </h2>
                    </button>
                </div>
            </section>
            <section id="mainPageAboutSection"></section>
        </div>
    );
}
