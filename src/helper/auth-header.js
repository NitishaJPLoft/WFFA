export function authHeader(multipart = false) {
    // return authorization header with jwt token
    let token = localStorage.getItem('token');

    if (token) {
        return multipart ? {
            'Authorization': 'Bearer ' + token,
            Accept: '*/*',
            'Access-Control-Allow-Origin': '*'
        } : {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*'
        };
    } else {
        return {};
    }
}