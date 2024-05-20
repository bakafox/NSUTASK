function getUserBoards(token) {
    fetch(`../api/boards`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function getBoardInfo(token, boardId) {
    fetch(`../api/board${boardId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function createBoard(token, name, description, submitsAutoaccept, submitsBodySize, submitsStrictDueDate) {
    fetch(`../api/boards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name, description, configSubmitsAutoaccept: submitsAutoaccept === '1',
            configSubmitsBodySize: submitsBodySize, configSubmitsStrictDueDate: submitsStrictDueDate === '1'
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function editBoardInfo(token, boardId, name, description, submitsAutoaccept, submitsBodySize, submitsStrictDueDate) {
    fetch(`../api/board${boardId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name, description, configSubmitsAutoaccept: submitsAutoaccept === '1',
            configSubmitsBodySize: submitsBodySize, configSubmitsStrictDueDate: submitsStrictDueDate === '1'
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function deleteBoard(token, boardId) {
    fetch(`../api/board${boardId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function getMembers(token, boardId) {
    fetch(`../api/board${boardId}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function addMember(token, boardId, userId) {
    fetch(`../api/board${boardId}/user${userId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function deleteMember(token, boardId, userId) {
    fetch(`../api/board${boardId}/user${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}
