function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=' + '' + ';' + 'expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}

function addToken() {
    const tokenInput = document.getElementById('get-token');
    const token = tokenInput.value.trim();
    if (token) {
    setCookie('session_token', token, 1);
    tokenInput.value = '';
    alert('Token added to cookie successfully!');
    } else {
    alert('Please enter a valid token.');
    }
}

function clearToken() {
    eraseCookie('session_token');
    alert('Token cleared from cookie successfully!');
}

function getToken() {
    return getCookie('session_token');
}