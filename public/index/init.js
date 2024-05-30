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
        if (data.role !== undefined) {
            currentBoard = null;
            document.querySelector('#tasklist').innerHTML = '<h1 class="tasklist-placeholder">Выберите доску, чтобы начать работу.</h1>';
            closeTaskmanView();
            updateBoardman();

            document.querySelector('#login').classList.add('hidden');
            document.querySelector('#nsutask').classList.remove('hidden');

            if (data.role === 'operator') {
                document.querySelectorAll('.for-operator').forEach(e => e.style.display = 'inherit');
                showActionsForOperator = true;
            }
            else {
                document.querySelectorAll('.for-operator').forEach(e => e.style.display = 'none');
                showActionsForOperator = false;
            }
        }
        else {
            document.querySelector('#login').classList.remove('hidden');
            document.querySelector('#nsutask').classList.add('hidden');
        }
    })
}



initLayout();