const API_BASENAME = "http://localhost:8000";
export const API_PATHS = {
    auth: API_BASENAME + "/me",
    refresh: API_BASENAME + "/refresh",
    register: API_BASENAME + "/register",
    login: API_BASENAME + "/login",
    logout: API_BASENAME + "/logout",
    user: API_BASENAME + "todo",

    create_ad: API_BASENAME + "todo",
    get_ads: API_BASENAME + "todo",
    get_my_ads: API_BASENAME + "todo",

    change_name: API_BASENAME + "todo",
    change_phone: API_BASENAME + "todo",
    change_email: API_BASENAME + "todo",
    change_password: API_BASENAME + "todo",
};

export const DEBUG = true;

export const CREATE_AD_STAGES = [
    "1. Основная информация",
    "2. Информация о животном",
    "3. Место и время",
    "4. Способ связи",
];

export const AD_INFO_DICT = {
    status: { lost: "Потеряно", found: "Найдено", any: "Любой" },
    type: { dog: "Собака", cat: "Кошка", any: "Любое" },
    breed: {
        labrador: "Лабрадор",
        german_shepherd: "Немецкая овчарка",
        poodle: "Пудель",
        metis: "Метис",
        any: "Любая",
    },
    size: {
        little: "Небольшой",
        medium: "Средний",
        big: "Крупный",
        any: "Любой",
    },
    danger: {
        safe: "Безопасен",
        danger: "Может быть опасен",
        unknown: "Опасен или нет неизвестно",
        any: "Любая",
    },
    region: {
        moscow_city: 'город Москва',
        moscow: 'Московская обл.',
        any: 'Любой'
    },
};

export const AD_FILTERS_DICT = {
    status: "Статус",
    type: "Животное",
    breed: "Порода",
    size: "Размер",
    danger: "Опасность",
    region: 'Регион',
    geoloc: 'Геолокация',
    radius: 'Радиус поиска'
};
