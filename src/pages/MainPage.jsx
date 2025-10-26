import "./MainPage.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainPage() {
    const animalsBack = 0;
    const activeAds = 0;
    const communityMembers = 0;
    const successRate = 0;

    return (
        <div id="main-page-container">
            <Header />
            <section id="main-page-intro-section">
                <h1>Find Your Pet</h1>
                <h2 style={{ textAlign: "center" }}>
                    Присоединяйся к нашему сообществу: ищи потерянных животных в
                    своей области или сообщай об их находке.
                </h2>
            </section>
            <section id="main-page-navigate-section">
                <div className="navigate-banner">
                    <img src='./icons/plus-square.svg' />
                    <h2>Создать объявление</h2>
                    <h6>Разместите объявление о пропавшем питомце</h6>
                </div>
                <div className="navigate-banner">
                    <img src='./icons/search-ad.svg' />
                    <h2>Найти объявление</h2>
                    <h6>Найдите пропавших животных в вашем районе</h6>
                </div>  
            </section>
            <h2>Статистика сервиса</h2>
            <section id="main-page-stats-section">
                <div className="stats-block">
                    <img src="./icons/house-check.svg" />
                    <div>
                        <h6>Животных возвращено</h6>
                        <h3 style={{ textAlign: "center" }}>{animalsBack}</h3>
                    </div>
                </div>
                <div className="stats-block">
                    <img src="./icons/search.svg" />
                    <div>
                        <h6>Активных объявлений</h6>
                        <h3 style={{ textAlign: "center" }}>{activeAds}</h3>
                    </div>
                </div>
                <div className="stats-block">
                    <img src="./icons/community.svg" />
                    <div>
                        <h6>Сообщество</h6>
                        <h3 style={{ textAlign: "center" }}>
                            {communityMembers} чел.
                        </h3>
                    </div>
                </div>
                <div className="stats-block">
                    <img src="./icons/heart.svg" />
                    <div>
                        <h6>Процент нахождения</h6>
                        <h3 style={{ textAlign: "center" }}>{successRate} %</h3>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
