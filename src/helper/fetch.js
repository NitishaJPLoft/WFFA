import {authHeader} from './auth-header';

export const BASE_URL = process.env.REACT_APP_API_URI;

/**
 *
 * @param {String} method  - MEthod GET/POST/PUT/DELETE
 * @param {String} url - api endpoint url
 * @param {object} data   - data
 */


export const apiCall = async (method, url, data) => {
    // for multipart  dont stringify it
    const response = await fetch(url, {
        method: method,
        mode: 'cors', // no-cors, *cors, same-origin
        headers: authHeader(),
        body: JSON.stringify(data),
    });

    return await response.json();
};
