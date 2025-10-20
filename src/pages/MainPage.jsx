import "./MainPage.css";

import { useRef } from "react";

import Header from "../components/Header";

export default function MainPage() {

    const headerRef = useRef();
    const mainPageIntroSectionRef = useRef();

    window.addEventListener("scroll", () => {
        if (document.documentElement.scrollTop > 20) {
            headerRef.current.classList.remove('atTheTop');
            mainPageIntroSectionRef.current.classList.remove('atTheTop');
        } else {
            headerRef.current.classList.add('atTheTop');
            mainPageIntroSectionRef.current.classList.add('atTheTop');
        };
    });

    return (
        <div id="mainPageContainer">
            <Header headerRef={headerRef} />
            <section id="mainPageIntroSection" className="atTheTop" ref={mainPageIntroSectionRef}>
                <h1>Find Your Pet</h1>
                <div id='mainPageIntroButtonsContainer'>
                    <button
                        className="mainPageIntroButton"
                        style={{
                            border: 'none',
                            background: "var(--accent-color)",
                        }}
                    >
                        <h5>
                            Создать объявление
                        </h5>
                    </button>
                    <button
                        className="mainPageIntroButton"
                        style={{
                            border: 'solid 2px var(--primary-color)',
                            backdropFilter: 'blur(10px)',
                            background: "transparent",
                        }}
                    >
                        <h5 style={{ color: 'var(--primary-color)' }}>
                            Найти объявление
                        </h5>
                    </button>
                </div>
            </section>
            <section id="mainPageAboutSection"></section>
        </div>
    );
}
