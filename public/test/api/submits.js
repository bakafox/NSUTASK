function getSubmitInfo() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    const taskId = prompt('Введите ID задачи:');
    fetch(`${apiBaseUrl}/board/${boardId}/task/${taskId}/submit`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function createSubmit() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    const taskId = prompt('Введите ID задачи:');
    const body = prompt('Введите текст посылки:');
    fetch(`${apiBaseUrl}/board/${boardId}/task/${taskId}/submit`, {
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

function deleteSubmit() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    const taskId = prompt('Введите ID задачи:');
    fetch(`${apiBaseUrl}/board/${boardId}/task/${taskId}/submit`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function getTaskSubmits() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    const taskId = prompt('Введите ID задачи:');
    fetch(`${apiBaseUrl}/board/${boardId}/task/${taskId}/submits`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function setSubmitStatus() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    const taskId = prompt('Введите ID задачи:');
    const submitId = prompt('Введите ID посылки:');
    const status = prompt('Выберите статус задачи ("accepted" или "rejected"):');
    fetch(`${apiBaseUrl}/board/${boardId}/task/${taskId}/submit/${submitId}`, {
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
