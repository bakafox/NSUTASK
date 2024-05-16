function getSubmitInfo(token, boardId, taskId) {
    fetch(`/board/${boardId}/task/${taskId}/submit`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function createSubmit(token, boardId, taskId, body) {
    fetch(`/board/${boardId}/task/${taskId}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ body })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function deleteSubmit(token, boardId, taskId) {
    fetch(`../api/board/${boardId}/task/${taskId}/submit`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function getTaskSubmits(token, boardId, taskId) {
    fetch(`../api/board/${boardId}/task/${taskId}/submits`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function setSubmitStatus(token, boardId, taskId, submitId, status) {
    fetch(`../api/board/${boardId}/task/${taskId}/submit/${submitId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}
