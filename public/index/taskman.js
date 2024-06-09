var currentTask = null;

function openTaskmanView() {
    document.querySelectorAll(".taskman-spacer").forEach(e => e.classList.remove('closed'));
    document.querySelector("#taskman").classList.remove('closed');
}

function closeTaskmanView() {
    document.querySelectorAll(".taskman-spacer").forEach(e => e.classList.add('closed'));
    document.querySelector("#taskman").classList.add('closed');

    currentTask = null;
}



// ФУНКЦИИ НИЖЕ ТРЕБУЮТ ПРЕВИЛЕГИЙ ПОЛЬЗОВАТЕЛЯ
function taskmanGetInfo(taskId) {
    const token = getToken();

    fetch(`../api/board${currentBoard}/task${taskId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const taskInfo = document.querySelector('#taskman-taskinfo');
        const taskSubmits = document.querySelector('#taskman-tasksubmits');
        taskInfo.innerHTML = '';
        taskSubmits.innerHTML = '';

        const taskTitle = document.createElement('h1');
        taskTitle.innerText = data.title;
        taskInfo.appendChild(taskTitle);

        const taskBody = document.createElement('p');
        taskBody.innerText = data.body;
        taskInfo.appendChild(taskBody);

        taskInfo.appendChild(document.createElement('br'));

        const taskDue = document.createElement('i');
        if (data.date_due !== null) {
            const taskDueDate = ISOtoDDMMYY(data.date_due);
            taskDue.innerText = `Срок сдачи: ДО ${taskDueDate} (не включительно)`;
            
            if (checkIfOutdated(data.date_due)) {
                taskDue.classList.add('task-outdated');
            }
        }
        else {
            taskDue.innerText = `Без крайнего срока сдачи.`;
        }
        taskInfo.appendChild(taskDue);

        currentTask = taskId;

        fetch(`../api/board${currentBoard}/task${taskId}/submit`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.message !== undefined) {
                taskSubmits.innerHTML = '<span class="pale">Вы ещё не отправляли посылку для этой задачи&nbsp;— <br>самое время отправить!</p>';
        
                document.querySelector('#taskman-actions__submit-body').classList.remove('hidden');
                document.querySelector('#taskman-actions__btn-submit').classList.remove('hidden');
                document.querySelector('#taskman-actions__btn-delete').classList.add('hidden');
            }
            else {
                const submitDate = new Date(data.date_submitted);
                const submitStatus = data.status;
                const submitText = data.text;

                const submitDateContainer = document.createElement('h1');
                submitDateContainer.innerText = `Посылка от ${submitDate.toLocaleString()}`;
                taskSubmits.appendChild(submitDateContainer);

                const submitStatusContainer = document.createElement('h3');
                submitStatusContainer.className = 'taskman-tasksubmit__status';

                if (submitStatus === 'pending') {
                    submitStatusContainer.innerText = '🤔 На рассмотрении';
                    submitStatusContainer.classList.add('taskman-tasksubmit__status-pending');
                    document.querySelector('#taskman-actions__btn-delete').classList.remove('hidden');
                }
                else if (submitStatus === 'accepted') {
                    submitStatusContainer.innerText = '🏆 ПРИНЯТО!';
                    submitStatusContainer.classList.add('taskman-tasksubmit__status-accepted');
                    document.querySelector('#taskman-actions__btn-delete').classList.add('hidden');
                }
                else if (submitStatus === 'rejected') {
                    submitStatusContainer.innerText = '🗿 Отклонено';
                    submitStatusContainer.classList.add('taskman-tasksubmit__status-rejected');
                    document.querySelector('#taskman-actions__btn-delete').classList.remove('hidden');
                }
                else {
                    submitStatusContainer.innerText = '❓ Неизвестно...';
                    document.querySelector('#taskman-actions__btn-delete').classList.remove('hidden');
                }
                taskSubmits.appendChild(submitStatusContainer);

                const submitTextContainer = document.createElement('p');
                submitTextContainer.className = 'taskman__tasksubmit-text';
                submitTextContainer.innerText = submitText;
                taskSubmits.appendChild(submitTextContainer);

                document.querySelector('#taskman-actions__submit-body').classList.add('hidden');
                document.querySelector('#taskman-actions__btn-submit').classList.add('hidden');
            }
 
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}

function taskmanSendSubmit() {
    const token = getToken();
    const submitText = document.querySelector('#taskman-actions__submit-body').value;

    fetch(`../api/board${currentBoard}/task${currentTask}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ body: submitText })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message !== undefined) {
            alert(data.message);
        }
        else {
            alert('Посылка успешно отправлена!');
        }
        document.querySelector('#taskman-actions__submit-body').value = '';
        taskmanGetInfo(currentTask);
    })
    .catch(error => console.error(error));
}

function taskmanDeleteSubmit() {
    const token = getToken();

    fetch(`../api/board${currentBoard}/task${currentTask}/submit`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message !== undefined) {
            alert(data.message);
        }
        else {
            alert('Посылка успешно удалена.');
        }
        taskmanGetInfo(currentTask);
    })
    .catch(error => console.error(error));
}



