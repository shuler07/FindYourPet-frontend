import React, { forwardRef } from "react";
import ReactDOM from 'react-dom'

export let reactify, YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker, YMapListener;

const ymaps_script = document.createElement('script');
ymaps_script.src = `https://api-maps.yandex.ru/v3/?apikey=${import.meta.env.VITE_YMAPS_API_KEY}&lang=ru_RU`;

const ymapsInitPromise = new Promise((resolve) => {
    ymaps_script.onload = async () => {
        const [ymaps3React] = await Promise.all([
            ymaps3.import('@yandex/ymaps3-reactify'),
            ymaps3.ready
        ]);
        reactify = ymaps3React.reactify.bindTo(React, ReactDOM, {
            forwardRef: true
        });
        ({ YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker, YMapListener } = reactify.module(ymaps3));
        resolve();
    };
});

document.head.appendChild(ymaps_script);