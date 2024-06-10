var currentBoard = null;

function toggleBoardmanView() {
    document.querySelectorAll(".boardman-spacer").forEach(e => e.classList.toggle('closed'));
    document.querySelector("#boardman-wrapper").classList.toggle('closed');
}



// ФУНКЦИИ НИЖЕ ТРЕБУЮТ ПРИВИЛЕГИЙ ПОЛЬЗОВАТЕЛЯ
function createBoardmanBoard(data) {
    const token = getToken();

    const boardContainerState = document.createElement('input');
    boardContainerState.className = 'boardman-item-state';
    boardContainerState.type = 'radio';
    boardContainerState.name = 'boardman-state';
    
    const boardContainer = document.createElement('label');
    boardContainer.className = 'boardman-item text-clip';
    boardContainer.innerText = data.name;
    boardContainer.title = data.description;

    // Несмотря на скрытие в CSS, JS назначает таргет и для
    // input, и для label, поэтому если бы здесь был boardContainer,
    // фукнция по click вызывалась бы ДВАЖДЫ... это JS, детка!
    boardContainerState.onclick = () => {
        closeTaskmanView();
        
        currentBoard = data.id;
        setLastBoard(currentBoard);
        document.querySelector('#groupinfo__title').innerText = data.description;
        
        updateTasklist();
    }

    // Эта логика нужна при первой инициализации boardman
    // для корректной обработки currentBoard из getLastBoard().
    if (data.id === +currentBoard) {
        boardContainerState.checked = true;
        document.querySelector('#groupinfo__title').innerText = data.description;
    }

    boardContainer.appendChild(boardContainerState);
    boardman.appendChild(boardContainer);
}

function updateBoardman() {
    const token = getToken();
    const boardman = document.querySelector('#boardman');

    fetch(`../api/boards`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        boardman.innerHTML = '';

        //console.log(data);
        if (data.length > 0) {
            for (const boardData of data) {
                createBoardmanBoard(boardData);
            }
        }
        else {
            boardman.innerHTML = '<span class="pale">У вас пока нет ни одной доски. Попросите оператора добавить вас в нужные доски, либо, если вы оператор, создайте новую.</span>';
        }
    })
    .catch(error => console.error(error));
}



// ФУНКЦИИ НИЖЕ ТРЕБУЮТ ПРИВИЛЕГИЙ ОПЕРАТОРА
function boardmanNewBoard() {
    const token = getToken();

    const formData = [
        { name: 'Название доски', type: 'text', allowEmpty: false },
        { name: 'Описание доски (видно сверху)', type: 'text', allowEmpty: true },
        { name: 'Автоматически принимать отправленные посылки', type: 'checkbox', allowEmpty: true },
        { name: 'Минимальная длина посылки (0 для отключения)', type: 'number', allowEmpty: false },
        { name: 'Запретить сдачу посылок после истечения даты', type: 'checkbox', allowEmpty: true }
    ];

    modalmanForm('Создание новой доски', formData)
    .then(formResults => {
        if (!formResults) { return; }

        fetch(`../api/boards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: formResults[0],
                description: formResults[1],
                configSubmitsAutoaccept: formResults[2],
                configSubmitsBodySize: formResults[3],
                configSubmitsStrictDueDate: formResults[4]
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) { alert(data.message); }
        
            else {
                currentBoard = data.id;
                updateBoardman();
                updateTasklist();
            }
        })
        .catch(error => console.error(error));
    });
}


function boardmanEditBoard() {
    const token = getToken();

    fetch(`../api/board${currentBoard}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        const formData = [
            { name: 'Название доски', type: 'text', defaultValue: data.board.name, allowEmpty: false },
            { name: 'Описание доски (видно сверху)', type: 'text', defaultValue: data.board.description, allowEmpty: true },
            { name: 'Автоматически принимать отправленные посылки', type: 'checkbox', defaultValue: data.config.submits_autoaccept, allowEmpty: true },
            { name: 'Минимальная длина посылки (0 для отключения)', type: 'number', defaultValue: data.config.submits_body_size, allowEmpty: false },
            { name: 'Запретить сдачу посылок после истечения даты', type: 'checkbox', defaultValue: data.config.submits_strict_due_date, allowEmpty: true }
        ];
    
        modalmanForm('Редактирование доски', formData)
        .then(formResults => {
            if (!formResults) { return; }

            fetch(`../api/board${currentBoard}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formResults[0],
                    description: formResults[1],
                    configSubmitsAutoaccept: formResults[2],
                    configSubmitsBodySize: formResults[3],
                    configSubmitsStrictDueDate: formResults[4]
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) { alert(data.message); }
            
                else {
                    currentBoard = data.id;
                    updateBoardman();
                    updateTasklist();
                }
            })
            .catch(error => console.error(error));
        });
    })
    .catch(error => console.error(error));
}

function boardmanDeleteBoard() {
    const token = getToken();

    if (confirm("Вы уверены, что хотите удалить ЦЕЛУЮ ДОСКУ!?")) {
        fetch(`../api/board${currentBoard}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) { alert(data.message); }

            else {
                initLayout();
            }
        })
        .catch(error => console.error(error));
    }
}

function boardmanBoardMembers() {
    const token = getToken();

    fetch(`../api/board${currentBoard}/users`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message !== undefined) { alert(data.message); }

        const usersLen = data.length;

        let usersInfo = [];
        for (let userId of data) {
            fetch(`../api/user${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                usersInfo.push([data.username, data.display_name]);

                if (usersInfo.length === usersLen) {
                    const action = prompt('Список участников доски: \n\n' + usersInfo.join('\n') + '\n\nЧто вы зотите сделать? \n"a" — Добавить нового участника; "r" — Удалить участника; (пропуск) — выйти.');

                    if (action === 'a') {
                        const userId = prompt('Введите ID участника:');
                        fetch(`../api/board${currentBoard}/user${userId}`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message) { alert(data.message); }

                            else { alert('Участник успешно добавлен!'); }
                        })
                        .catch(error => console.error(error));
                    }
                    else if (action === 'r') {
                        const userId = prompt('Введите ID участника:');
                        fetch(`../api/board${currentBoard}/user${userId}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message) { alert(data.message); }

                            else { alert('Участник успешно удалён!'); }
                        })
                        .catch(error => console.error(error));
                    }
                }
            })
            .catch(error => console.error(error));
        }
    })
    .catch(error => console.error(error));
}
