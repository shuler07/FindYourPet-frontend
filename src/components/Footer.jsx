import "./Footer.css";

export default function Footer() {
    return (
        <div id="footer">
            <h6 style={{ color: "#eee" }}>
                © 2025 FindYourPet. Все права защищены. Сделано с любовью к
                питомцам{" "}
                <a
                    href="authors"
                    style={{
                        textDecoration: "none",
                        color: "white",
                        fontWeight: "700",
                    }}
                >
                    студентами университета МАИ
                </a>
            </h6>
        </div>
    );
}
