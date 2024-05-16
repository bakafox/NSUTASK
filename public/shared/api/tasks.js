function getBoardTasks(token, boardId) {
    fetch(`../api/board/${boardId}/tasks`, {
        headers: {
        'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function getTaskInfo(token, boardId, taskId) {
    fetch(`../api/board/${boardId}/task/${taskId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function createTask(token, boardId, title, body, dateDue, priority) {
    fetch(`../api/board/${boardId}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, body, dateDue, priority })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function editTaskInfo(token, boardId, taskId, title, body, dateDue, priority) {
    fetch(`../api/board/${boardId}/task/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, body, dateDue, priority })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function deleteTask(token, boardId, taskId) {
        fetch(`../api/board/${boardId}/task/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}
