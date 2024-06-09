function updateTasklist() {
    const token = getToken();
    const tasklist = document.querySelector('#tasklist');
    
    if (currentBoard === null) {
        document.querySelector('#tasklist').innerHTML = '<h1 class="tasklist-placeholder">Выберите доску, чтобы начать работу.</h1>';
        return;
    }

    fetch(`../api/board${currentBoard}/tasks`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        tasklist.innerHTML = '';

        if (data.length > 0) {
            for (const taskId of data) {
                createTasklistTask(currentBoard, taskId);
            }
        }
        else {
            tasklist.innerHTML = '<h2 class="tasklist-placeholder">Похоже, оператор этой доски пока<br>не создал ни одной задачи... пичаль.</h2>';
        }

        if (showActionsForOperator) {
            document.querySelector('#groupinfo-actions').classList.remove('hidden');
            document.querySelector('#boardman-actions__edit-btn').disabled = false;
            document.querySelector('#boardman-actions__delete-btn').disabled = false;
        }

    })
    .catch(error => console.error(error));
}



// ФУНКЦИИ НИЖЕ ТРЕБУЮТ ПРЕВИЛЕГИЙ ПОЛЬЗОВАТЕЛЯ
function createCategory(categoryId, categoryName) {
    const categoryContainer = document.createElement('section');
    categoryContainer.className = 'taskcat';
    categoryContainer.id = `taskcat-${categoryId}`;

    const categoryWrapper = document.createElement('div');
    categoryWrapper.className = 'taskcat-wrapper';

    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'taskcat-header';

    const categoryTitle = document.createElement('h3');
    categoryTitle.className = 'taskcat-header__title text-clip';
    categoryTitle.innerText = categoryName;
    const categoryContent = document.createElement('div');
    categoryContent.className = 'taskcat-content';

    categoryHeader.appendChild(categoryTitle);
    categoryWrapper.appendChild(categoryHeader);
    categoryWrapper.appendChild(categoryContent);

    categoryContainer.appendChild(categoryWrapper);

    tasklist.appendChild(categoryContainer);
}

function createTasklistTask(boardId, taskId) {
    const token = getToken();

    fetch(`../api/board${currentBoard}/task${taskId}/submit`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        let categoryId = 'unknown', categoryName = 'Неизвестно';

        if (data.status === undefined) {
            categoryId = 'to-do';
            categoryName = '⚒️ К выполнению';
        }
        else {
            if (data.status === 'pending') {
                categoryId = 'pending';
                categoryName = '⏳ На рассмотрении...';
            }
            else if (data.status === 'accepted') {
                categoryId = 'accepted';
                categoryName = '✅ Выполнено!';
            }
            else if (data.status === 'rejected') {
                categoryId = 'rejected';
                categoryName = '⚠️ Отклонено';
            }

            // TODO: либо где-то здесь, либо в APIшке затесался баг,
            // из-за которого интерфейс отображает только ОДНУ задачу
            // с посылкой в любом статусе, кроме "to-do". 
            // Скорее всего, проблема где-то в API — и, судя по всему,
            // последний "забывает" или не может получить досут к статусам
            // прошлых посылок после отправки или изменения новой.
        }

        fetch(`../api/board${boardId}/task${taskId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            let category = document.querySelector(`#taskcat-${categoryId}`);
            if (!category) {
                createCategory(categoryId, categoryName);
                category = document.querySelector(`#taskcat-${categoryId}`);
            }

            const taskContainer = document.createElement('article');
            taskContainer.className = 'task';

            const taskContent = document.createElement('div');
            taskContent.className = 'task-content';
        
            const taskTitle = document.createElement('h3');
            taskTitle.className = 'task-content__title text-clip';
            taskTitle.innerText = data.title;

            const taskText = document.createElement('p');
            taskText.className = 'task-content__text text-clip';
            taskText.innerText = data.body;

            const taskDue = document.createElement('i');
            taskDue.className = 'task-content__due';
            //console.log(data.date_due);
            if (data.date_due !== null) {
            const taskDueDate = ISOtoDDMMYY(data.date_due);
                taskDue.innerText = `Срок сдачи: ДО ${taskDueDate}`;

                if (checkIfOutdated(data.date_due)) {
                    taskDue.classList.add('task-outdated');
                }
            }
        
            taskContent.onclick = () => {
                taskmanGetInfo(taskId);
                openTaskmanView();
            }

            taskContent.appendChild(taskTitle);
            taskContent.appendChild(taskText);
            taskContent.appendChild(taskDue);
            taskContainer.appendChild(taskContent);

            if (showActionsForOperator) {
                const taskActions = document.createElement('div');
                taskActions.className = 'task-actions';

                const taskActionsEdit = document.createElement('button');
                taskActionsEdit.className = 'task-actions__edit';
                taskActionsEdit.innerText = 'Изменить';
                taskActionsEdit.onclick = () => tasklistEditTask(taskId);

                const taskActionsDelete = document.createElement('button');
                taskActionsDelete.className = 'task-actions__delete';
                taskActionsDelete.innerText = 'Удалить';
                taskActionsDelete.onclick = () => tasklistDeleteTask(taskId);

                const taskActionsSubmits = document.createElement('button');
                taskActionsSubmits.className = 'task-actions__submits';
                taskActionsSubmits.innerText = 'Посылки';
                taskActionsSubmits.onclick = () => tasklistSubmitsPanel(taskId);

                taskActions.appendChild(taskActionsEdit);
                taskActions.appendChild(taskActionsDelete);
                taskActions.appendChild(taskActionsSubmits);
                taskContainer.appendChild(taskActions);
            }

            category.querySelector('.taskcat-content').appendChild(taskContainer);
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}



// ФУНКЦИИ НИЖЕ ТРЕБУЮТ ПРЕВИЛЕГИЙ ОПЕРАТОРА
function tasklistNewTask() {
    const token = getToken();

    const title = prompt('Введите заголовок новой задачи:');
    const body = prompt('Введите текст новой задачи:');
    const dateDue = DDMMYYtoISO(prompt('Введите срок сдачи новой задачи (ДД.ММ.ГГ, НЕ включительно; пропуск — без срока):'));
    //console.log(dateDue);

    fetch(`../api/board${currentBoard}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
			title: title,
			body: body,
			dateDue: dateDue
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message !== undefined) { alert(data.message); }

        updateTasklist();
    })
    .catch(error => console.error(error));
}

function tasklistEditTask(taskId) {
    const token = getToken();

    const title = prompt('Введите новой заголовок задачи:');
    const body = prompt('Введите новой текст задачи:');
    const dateDue = DDMMYYtoISO(prompt('Введите новый срок сдачи задачи (ДД.ММ.ГГ, НЕ включительно; пропуск — без срока):'));
    //console.log(dateDue);

    fetch(`../api/board${currentBoard}/task${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
			title: title,
			body: body,
			dateDue: dateDue
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message !== undefined) { alert(data.message); }

        updateTasklist();
    })
    .catch(error => console.error(error));
}

function tasklistDeleteTask(taskId) {
    const token = getToken();

    if (confirm("Вы уверены, что хотите удалить эту задачу?")) {
        fetch(`../api/board${currentBoard}/task${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message !== undefined) { alert(data.message); }

            updateTasklist();
        })
        .catch(error => console.error(error));
    }
}

function tasklistSubmitsPanel(taskId) {
    const token = getToken();

    fetch(`../api/board${currentBoard}/task${taskId}/submits`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => response.json())
    
        .then(data => {
            if (data.length > 0) {
                const selectedSubmit = prompt(`Выберите посылку для просмотра: ${data.toString()}`);

                fetch(`../api/board${currentBoard}/task${taskId}/submit${selectedSubmit}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message) { alert(data.message); }

                    let newSubmitStatus = prompt('Статус посылки: ' + data.status
                    + '\n\nТекст посылки: ' + data.text
                    + '\n\nДата отправления: ' + ISOtoDDMMYY(data.date_submitted)
                    + '\n\nПРИНЯТЬ — "a", ОТКЛОНИТЬ — "r", НЕ МЕНЯТЬ — (пропуск):');

                    if (newSubmitStatus !== 'a' && newSubmitStatus !== 'r') { return; }
                    else if (newSubmitStatus === 'a') { newSubmitStatus = 'accepted'; }
                    else if (newSubmitStatus === 'r') { newSubmitStatus = 'rejected'; }

                    fetch(`../api/board${currentBoard}/task${taskId}/submit${selectedSubmit}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            status: newSubmitStatus
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message) { alert(data.message); }

                        alert(`Статус посылки изменён на "${newSubmitStatus}"!`);
                    })
                    .catch(error => console.error(error));
                })
                .catch(error => console.error(error));
            }
            else {
                alert('Нет посылок для просмотра.');
            }
        })
        .catch(error => alert(error.message));
}