import "./Header.css";

export default function Header({ headerRef }) {
    return (
        <div id="header" className="atTheTop" ref={headerRef}>
            <HeaderLogo />
            <HeaderBar />
        </div>
    );
}

function HeaderLogo() {
    return (
        <a id="headerLogo" href="">
            Find Your Pet
        </a>
    );
}

function HeaderBar() {
    return (
        <div id="headerBar">
            <div
                className="headerButton"
                style={{
                    border: `solid 2px var(--primary-color)`,
                    background: "transparent",
                }}
                onClick={() => {}}
            >
                <h3 style={{ color: "var(--primary-color)" }}>помощь</h3>
            </div>
            <div
                className="headerButton"
                style={{
                    border: `none`,
                    background: "var(--primary-color)",
                }}
                onClick={() => {}}
            >
                <h6 style={{ color: "var(--main-color)" }}>войти</h6>
            </div>
        </div>
    );
}
