const STORAGE_TOKEN = 'PoGqhfwwrCMiqiUGF2fIc3887QfcP9Da6hYJwLAhtLjAvjbDpU2Z0AJ3Hs7KtAm91BtVGB1UaxAFHXkI';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Set Item to Backend
 * @param {key} key 
 * @param {Value} value 
 * @returns 
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}

/**
 * 
 * @param {key} key 
 * @returns Item from backend
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}