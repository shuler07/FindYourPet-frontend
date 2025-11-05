export const API_PATHS = {
    auth: "todo",
    register: "todo",
    login: "todo",

    create_ad: "todo",
    get_ads: "todo",
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
};

export const AD_FILTERS_DICT = {
    status: "Статус",
    type: "Животное",
    breed: "Порода",
    size: "Размер",
    danger: "Опасность",
};
