function login(username, password) {
    fetch(`../api/users/login`, {
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

function register(username, displayName, password, role) {
    fetch(`../api/users/register`, {
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

function getUsers(token) {
    fetch(`../api/users`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function getUser(token, userId) {
    fetch(`../api/user/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function findUsers(token, query) {
    fetch(`../api/findUsers?q=${query}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}
