function setPreferenceToLocalStorage(key: string, value: string) {
    if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
    }
}

function loadPreferenceFromLocalStorage(key: string): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem(key);
    }
    return null;
}

export { setPreferenceToLocalStorage, loadPreferenceFromLocalStorage };