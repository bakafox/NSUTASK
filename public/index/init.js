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
            
            document.querySelector('#login').classList.add('hidden');
            document.querySelector('#nsutask').classList.remove('hidden');
            
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
                
            // Пробуем перейти в lastBoard, если соответствующая кука существует
            const lastBoard = getLastBoard();
            if (lastBoard !== null) {
                currentBoard = lastBoard;
            }
            else {
                currentBoard = null;
            }

            closeTaskmanView();
            updateBoardman();
            updateTasklist();
        }
        // Если пользователь не залогинен
        else {
            document.querySelector('#login').classList.remove('hidden');
            document.querySelector('#nsutask').classList.add('hidden');
        }
    })
}



initLayout();