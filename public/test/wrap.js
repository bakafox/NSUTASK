// USERS
function wrap_login() {
    const username = prompt('Введите имя пользователя:');
    const password = prompt('Теперь введите пароль:');

    return login(username, password);
}
function wrap_register() {
    const username = prompt('Введите имя пользователя:');
    const displayName = prompt('Введите отображаемое имя:');
    const password = prompt('Теперь введите пароль:');
    const role = prompt('Выберите роль ("user" или "operator"):');

    return register(username, displayName, password, role);
}

function wrap_getUsers() {
    const token = getToken();

    return getUsers(token);
}
function wrap_getUser() {
    const token = getToken();
    const userId = prompt('Введите ID пользователя:');

    return getUser(token, userId);
}
function wrap_findUsers() {
    const token = getToken();
    const query = prompt('Введите поисковый запрос:');

    return findUsers(token, query);
}



// BOARDS
function wrap_getUserBoards() {
    const token = getToken();

    return getUserBoards(token);
}
function wrap_getBoardInfo() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');

    return getBoardInfo(token, boardId);
}

function wrap_createBoard() {
    const token = getToken();
    const name = prompt('Введите имя доски:');
    const description = prompt('Введите описание доски:');
    const submitsAutoaccept = prompt('Включить автопринятие посылок? (0/1)');
    const submitsBodyMin = prompt('Введиье минимальную длину текста посылки (0 для отключения):');
    const submitsStrictDueDate = prompt('Включить строгую дату сдачи? (0/1)');

    return createBoard(token, name, description, submitsAutoaccept, submitsBodyMin, submitsStrictDueDate);
}
function wrap_editBoardInfo() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');
    const name = prompt('Введите имя доски:');
    const description = prompt('Введите описание доски:');
    const submitsAutoaccept = prompt('Включить автопринятие посылок? (0/1)');
    const submitsBodyMin = prompt('Введиье минимальную длину текста посылки (0 для отключения):');
    const submitsStrictDueDate = prompt('Включить строгую дату сдачи? (0/1)');

    return editBoardInfo(token, boardId, name, description, submitsAutoaccept, submitsBodyMin, submitsStrictDueDate);
}
function wrap_deleteBoard() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');

    return deleteBoard(token, boardId);
}

function wrap_getMembers() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');

    return getMembers(token, boardId);
}
function wrap_addMember() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');
    const userId = prompt('Введите ID пользователя:');

    return addMember(token, boardId, userId);
}
function wrap_deleteMember() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');
    const userId = prompt('Введите ID пользователя:');

    return deleteMember(token, boardId, userId);
}



// TASKS
function wrap_getBoardTasks() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');

    return getBoardTasks(token, boardId);
}
function wrap_getTaskInfo() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');
    const taskId = prompt('Введите ID задачи:');

    return getTaskInfo(token, boardId, taskId);
}

function wrap_createTask() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');
    const title = prompt('Введите заголовок задачи:');
    const body = prompt('Введите текст задачи:');
    const dateDue = prompt('Введите срок задачи в формате JS ISO-8601:');
    const priority = prompt('Выберите приоритет задачи ("low", "normal" или "high"):');

    return createTask(token, boardId, title, body, dateDue, priority);
}
function wrap_editTaskInfo() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');
    const title = prompt('Введите заголовок задачи:');
    const body = prompt('Введите текст задачи:');
    const dateDue = prompt('Введите срок задачи в формате JS ISO-8601:');
    const priority = prompt('Выберите приоритет задачи ("low", "normal" или "high"):');

    return editTaskInfo(token, boardId, title, body, dateDue, priority);
}
function wrap_deleteTask() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');
    const taskId = prompt('Введите ID задачи:');

    return deleteTask(token, boardId, taskId);
}



// SUBMITS
function wrap_getSubmitInfo() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');
    const taskId = prompt('Введите ID задачи:');

    return getSubmitInfo(token, boardId, taskId);
}
function wrap_createSubmit() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');
    const taskId = prompt('Введите ID задачи:');
    const body = prompt('Введите текст посылки:');

    return createSubmit(token, boardId, taskId, body);
}
function wrap_deleteSubmit() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');
    const taskId = prompt('Введите ID задачи:');

    return deleteSubmit(token, boardId, taskId);
}

function wrap_getTaskSubmits() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');
    const taskId = prompt('Введите ID задачи:');

    return getTaskSubmits(token, boardId, taskId);
}
function wrap_setSubmitStatus() {
    const token = getToken();
    const boardId = prompt('Введите ID доски:');
    const taskId = prompt('Введите ID задачи:');
    const submitId = prompt('Введите ID посылки:');
    const status = prompt('Выберите статус задачи ("accepted" или "rejected"):');

    return setSubmitStatus(token, boardId, taskId, submitId, status);
}
