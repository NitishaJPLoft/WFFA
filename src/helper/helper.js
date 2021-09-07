import {authHeader} from './auth-header';

export const helpers = {
    getSiteId,
    login,
    forgotPassword,
    app,
    tournament,
    formDataMultipart,
    user,
    topyauser,
    getParsedDate,
    teammembers,
    teams,
    userDetails,
    getDateFormat,
    judges,
    systemTournaments,
    tournamentDropdown
};

const apiUrl = process.env.REACT_APP_API_URI;

async function getSiteId(method, data) {
    // Default options are marked with *
    const response = await fetch(`${apiUrl}getSiteId`, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    return await response.json(); // parses JSON response into native JavaScript objects
}

async function login(method, data) {
    // Default options are marked with *
    const response = await fetch(`${apiUrl}auth/login`, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    return await response.json(); // parses JSON response into native JavaScript objects
}

async function forgotPassword(method, data) {
    // Default options are marked with *
    const response = await fetch(`${apiUrl}forgotpassword`, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    return await response.json(); // parses JSON response into native JavaScript objects
}

async function app(method) {
    const app_id = localStorage.getItem('appId');
    // Default options are marked with *
    let url = `${apiUrl}app?app_id=${app_id}`;
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: authHeader()
    });

    return await response.json(); // parses JSON response into native JavaScript objects
}

async function tournament(method) {
    // Default options are marked with *
    const appId = localStorage.getItem('appId');
    const userId = localStorage.getItem('user') ? (JSON.parse(localStorage.getItem('user'))).id : null;

    let url = `${apiUrl}tournament?userId=${userId}&appId=${appId}`;

    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: authHeader()
    });

    return await response.json(); // parses JSON response into native JavaScript objects
}

async function judges(method, type = '', stage = '', tournamentId = '', stageId = '', roundId = '', groupId = '') {
    // Default options are marked with *
    const appId = localStorage.getItem('appId');

    let url = `${apiUrl}judge/tournamentlist?appId=${appId}&type=${type}&stage=${stage}&tournamentId=${tournamentId}&stageId=${stageId}&roundId=${roundId}&groupId=${groupId}`;

    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: authHeader()
    });

    return await response.json(); // parses JSON response into native JavaScript objects
}

async function systemTournaments(method, type = '', stage = '', tournamentId = '', stageId = '', roundId = '', groupId) {
    // Default options are marked with *

    let url = `${apiUrl}system/tournamentList?type=${type}&stage=${stage}&tournamentId=${tournamentId}&stageId=${stageId}&roundId=${roundId}&groupId=${groupId}`;

    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: authHeader()
    });

    return await response.json(); // parses JSON response into native JavaScript objects
}

async function tournamentDropdown(method, type, stageType) {
    // Default options are marked with *
    const appId = localStorage.getItem('appId');

    let url = `${apiUrl}tournamentdropdown?appId=${appId}&type=${type}&stage=${stageType}`;

    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: authHeader()
    });

    return await response.json(); // parses JSON response into native JavaScript objects
}

async function user(method, appId = null) {
    // Default options are marked with *
    let url = `${apiUrl}user?app_id=${appId}`;

    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: authHeader()
    });

    return await response.json(); // parses JSON response into native JavaScript objects
}

async function userDetails(method, userId, appId) {
    let url = `${apiUrl}user/${userId}?app_id=${appId}`;
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: authHeader()
    });

    return await response.json(); // parses JSON response into native JavaScript objects
}

async function teammembers(method, team_id, tournamentId) {
    // Default options are marked with *
    const response = await fetch(`${apiUrl}tournament/teammembers?teamId=${team_id}&tournamentId=${tournamentId}`, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: authHeader()
    });

    return await response.json(); // parses JSON response into native JavaScript objects
}

async function teams(method, type, stageId = null) {
    // Default options are marked with *
    const response = await fetch(`${apiUrl}tournament/teams?type=${type}&stageId=${stageId}`, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: authHeader()
    });

    return await response.json(); // parses JSON response into native JavaScript objects
}

async function topyauser(method, appId) {

    // Default options are marked with *
    let url = `${apiUrl}topya/user?app_id=${appId}`;
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: authHeader()
    });

    return await response.json(); // parses JSON response into native JavaScript objects
}

async function formDataMultipart(method, url, data) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: authHeader(true),
        body: data,
        // body data type must match "Content-Type" header
    });

    return await response.json(); // parses JSON response into native JavaScript objects
}

function getParsedDate(strDate) {
    const strSplitDate = String(strDate).split(' ');
    let date = new Date(strSplitDate[0]);
    let time = strSplitDate[1];

    let dd = date.getDate();
    let mm = date.getMonth() + 1; //January is 0!

    const yyyy = date.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    date = mm + "-" + dd + "-" + yyyy + " " + time;
    return date.toString();
}

function getDateFormat(date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1; //January is 0!

    const yyyy = date.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    return (yyyy + '-' + mm + '-' + dd).toString();
}

