function getBoardTasks() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    fetch(`${apiBaseUrl}/board/${boardId}/tasks`, {
        headers: {
        'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function getTaskInfo() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    const taskId = prompt('Введите ID задачи:');
    fetch(`${apiBaseUrl}/board/${boardId}/task/${taskId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function createTask() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    const title = prompt('Введите заголовок задачи:');
    const body = prompt('Введите текст задачи:');
    const dateDue = prompt('Введите срок задачи в формате JS ISO-8601:');
    const priority = prompt('Выберите приоритет задачи ("low", "normal" или "high"):');
    fetch(`${apiBaseUrl}/board/${boardId}/tasks`, {
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

function editTaskInfo() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    const title = prompt('Введите заголовок задачи:');
    const body = prompt('Введите текст задачи:');
    const dateDue = prompt('Введите срок задачи в формате JS ISO-8601:');
    const priority = prompt('Выберите приоритет задачи ("low", "normal" или "high"):');
    fetch(`${apiBaseUrl}/board/${boardId}/task/${taskId}`, {
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

function deleteTask() {
    const token = getToken();

    const boardId = prompt('Введите ID доски:');
    const taskId = prompt('Введите ID задачи:');
        fetch(`${apiBaseUrl}/board/${boardId}/task/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}
