import "./Header.css";

export default function Header({}) {
    return (
        <div id="header">
            <HeaderLogo />
            <HeaderBar />
        </div>
    );
}

function HeaderLogo() {
    return (
        <a id="headerLogo" href="">
            Find your pet
        </a>
    );
}

function HeaderBar() {
    return (
        <div id="headerBar">
            <HeaderButton
                bColor="var(--primaryColor)"
                bgColor="transparent"
                tColor="var(--primaryColor)"
                text="помощь"
                action={() => console.log("help message")}
            />
            <HeaderButton
                bColor="var(--containerColor)"
                bgColor="var(--containerColor)"
                tColor="var(--inverseColor)"
                text="войти"
                action={() => console.log("authentication")}
            />
        </div>
    );
}

function HeaderButton({ bColor, bgColor, tColor, text, action }) {
    return (
        <div
            className="headerButton"
            style={{ border: `solid 1px ${bColor}`, background: bgColor }}
            onClick={action}
        >
            <h6 style={{ color: tColor }}>{text}</h6>
        </div>
    );
}
