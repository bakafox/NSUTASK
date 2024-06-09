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
    
    boardContainer.className = 'boardman-item';
    boardContainer.innerText = data.name;
    boardContainer.title = data.description;
    boardContainer.classList.add('text-clip');

    // Несмотря на скрытие в CSS, JS назначает таргет и для
    // input, и для label, поэтому если бы здесь был boardContainer,
    // фукнция по click вызывалась бы ДВАЖДЫ... это JS, детка!
    boardContainerState.onclick = function() {
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

    const name = prompt("Введите имя новой доски:");
    const description = prompt("Введите описание новой доски:");
    const configSubmitsAutoaccept = confirm("Включить автоматическое принятие посылок?");
    const configSubmitsBodySize = prompt("Введиье минимальную длину текста посылки (0 для отключения):");
    const configSubmitsStrictDueDate = confirm("Включить запрет сдачи посылок после истечения даты?");

    fetch(`../api/boards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: name,
            description: description,
            configSubmitsAutoaccept: configSubmitsAutoaccept,
            configSubmitsBodySize: configSubmitsBodySize,
            configSubmitsStrictDueDate: configSubmitsStrictDueDate
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) { alert(data.message); }
    
        else {
            createBoardmanBoard(data.id);
            updateTasklist();
        }
    })
    .catch(error => console.error(error));
}

function boardmanEditBoard() {
    const token = getToken();

    const name = prompt("Введите новое имя доски:");
    const description = prompt("Введите новое описание доски:");

    if (confirm("Желаете изменить настройки доски?")) {
        const configSubmitsAutoaccept = confirm("Включить автоматическое принятие посылок?");
        const configSubmitsBodySize = prompt("Введиье минимальную длину текста посылки (0 для отключения):");
        const configSubmitsStrictDueDate = confirm("Включить запрет сдачи посылок после истечения даты?");
        
        fetch(`../api/board${currentBoard}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                description: description,
                configSubmitsAutoaccept: configSubmitsAutoaccept,
                configSubmitsBodySize: configSubmitsBodySize,
                configSubmitsStrictDueDate: configSubmitsStrictDueDate
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) { alert(data.message); }

            else {
                updateTasklist();
            }
        })
        .catch(error => console.error(error));
    }
    else {
        fetch(`../api/board${currentBoard}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                description: description,
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) { alert(data.message); }

            else {
                updateTasklist();
            }
        })
        .catch(error => console.error(error));
    }
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
