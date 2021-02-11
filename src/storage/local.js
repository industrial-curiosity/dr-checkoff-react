export const loadFromStorage = (key) => {
    if (localStorage[key]) {
        return JSON.parse(localStorage[key]);
    }
    return null;
}

export const saveToStorage = (key, json) => {
    localStorage[key] = JSON.stringify(json);
}

export const deleteFromStorage = (key) => {
    localStorage.removeItem(key);
}
