var showActionsForOperator = null;



function initLayout() {
    const token = getToken();

    fetch(`../api/users/role`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Если пользователь залогинен
        if (data.role !== undefined) {
            // Отображение действий, доступных только оператору,
            // если пользователь является оператором.
            if (data.role === 'operator') {
                document.querySelectorAll('.for-operator').forEach(e => e.style.display = 'inherit');
                showActionsForOperator = true;
                }
            else {
                document.querySelectorAll('.for-operator').forEach(e => e.style.display = 'none');
                showActionsForOperator = false;
            }
                
            // Пробуем перейти в lastBoard, если есть соответствующая кука
            // и такая доска действительно доступна пользователю.
            const lastBoard = getLastBoard();
            if (lastBoard !== null) {
                fetch(`../api/board${lastBoard}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .catch(() => { lastBoard = null; });
            }
            else {
                lastBoard = null;
            }
            currentBoard = lastBoard;

            closeTaskmanView();
            updateBoardman();
            updateTasklist();

            document.querySelector('#nsutask').classList.remove('hidden');
        }
        // Если пользователь не залогинен
        else {
            // Перенаправляем его на login.html!
            window.location.href = '/login.html';
        }
    })
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        clearToken();
        //clearLastBoard();
        initLayout();
    }
}



initLayout();