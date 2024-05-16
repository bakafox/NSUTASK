function getUserBoards() {
    const token = getToken();

    fetch(`${apiBaseUrl}/boards`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function getBoardInfo() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    fetch(`${apiBaseUrl}/board/${boardId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function createBoard() {
    const token = getToken();

    const name = prompt('Введите имя доски:');
    const description = prompt('Введите описание доски:');
    const submitsAutoaccept = prompt('Включить автопринятие посылок? (0/1)');
    const submitsBodyMin = prompt('Введиье минимальную длину текста посылки (0 для отключения):');
    const submitsStrictDueDate = prompt('Включить строгую дату сдачи? (0/1)');

    fetch(`${apiBaseUrl}/boards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name, description, configSubmitsAutoaccept: submitsAutoaccept === '1',
            configSubmitsBodyMin: submitsBodyMin, configSubmitsStrictDueDate: submitsStrictDueDate === '1'
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function editBoardInfo() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    const name = prompt('Введите имя доски:');
    const description = prompt('Введите описание доски:');
    const submitsAutoaccept = prompt('Включить автопринятие посылок? (0/1)');
    const submitsBodyMin = prompt('Введиье минимальную длину текста посылки (0 для отключения):');
    const submitsStrictDueDate = prompt('Включить строгую дату сдачи? (0/1)');

    fetch(`${apiBaseUrl}/board/${boardId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name, description, configSubmitsAutoaccept: submitsAutoaccept === '1',
            configSubmitsBodyMin: submitsBodyMin, configSubmitsStrictDueDate: submitsStrictDueDate === '1'
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function deleteBoard() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    fetch(`${apiBaseUrl}/board/${boardId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function getMembers() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    fetch(`${apiBaseUrl}/board/${boardId}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function addMember() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    const userId = prompt('Введите ID пользователя:');
    fetch(`${apiBaseUrl}/board/${boardId}/user/${userId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function deleteMember() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    const userId = prompt('Введите ID пользователя:');
    fetch(`${apiBaseUrl}/board/${boardId}/user/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}
