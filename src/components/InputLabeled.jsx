import "./InputLabeled.css";

import { useEffect, useState } from "react";

import { DEBUG } from "../data";

export default function InputLabeled({
    inputId,
    type,
    placeholder,
    autoComplete,
    label,
    ref,
    value,
}) {
    const [text, setText] = useState(value);

    return (
        <div className="input-labeled">
            <label htmlFor={inputId}>{label}</label>
            <input
                id={inputId}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                ref={ref}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </div>
    );
}

export function InputAddressLabeled({
    inputId,
    type,
    placeholder,
    autoComplete,
    label,
    ref,
    value,
}) {
    const [text, setText] = useState(value);
    useEffect(() => {
        if (text.length <= 3) return;

        const handler = setTimeout(() => {
            async function getResponse() {
                try {
                    const response = await fetch(
                        `https://suggest-maps.yandex.ru/v1/suggest?apikey=${
                            import.meta.env.VITE_YMAPS_GEOSUGGEST_API_KEY
                        }&text=${text}&results=5`
                    );

                    const data = await response.json();

                    if (DEBUG)
                        console.log(
                            "Searching addresses. Data received:",
                            data
                        );
                } catch (error) {
                    console.error("Searchin addresses. Error:", error);
                }
            }

            getResponse();
        }, 2000);

        return () => clearTimeout(handler);
    }, [text]);

    return (
        <div className="input-labeled">
            <label htmlFor={inputId}>{label}</label>
            <input
                id={inputId}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                ref={ref}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </div>
    );
}
