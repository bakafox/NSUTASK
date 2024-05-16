function login() {
    const username = prompt('Введите имя пользователя:');
    const password = prompt('Теперь введите пароль:');
    fetch(`${apiBaseUrl}/users/login`, {
    method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error(error));
}

function register() {
    const username = prompt('Введите имя пользователя:');
    const displayName = prompt('Введите отображаемое имя:');
    const password = prompt('Теперь введите пароль:');
    const role = prompt('Выберите роль ("user" или "operator"):');
    fetch(`${apiBaseUrl}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, display_name: displayName, password, role })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function getUsers() {
    const token = getToken();

    fetch(`${apiBaseUrl}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function getUser() {
    const token = getToken();

    const userId = prompt('Введите ID пользователя:');
    fetch(`${apiBaseUrl}/user/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function findUsers() {
    const token = getToken();

    const query = prompt('Введите поисковый запрос:');
    fetch(`${apiBaseUrl}/findUsers?q=${query}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}