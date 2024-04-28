function getHelp(elm) {
    alert('пока не реализовано!');
}

function toggleLoginRegister() {
    const isLogin = document.querySelector('#auth-login').style.display === 'none';
    document.querySelector('#auth-login').style.display = isLogin ? 'inherit' : 'none';
    document.querySelector('#auth-register').style.display = isLogin ? 'none' : 'inherit';
}



document.querySelector('#auth-login').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.querySelector('#auth-login_login').value;
    const password = document.querySelector('#auth-login_password').value;

    fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
    .then(res => {
        if (res.ok) {
            res.json().then(data => {
                document.cookie = `session=${data.session}; path=/; expires=${Date.now() + 24*60*60*1000};`;
                alert(data.message);
                window.location.href = '/';
            });
        }
        else {
            res.json().then(data => {
                alert('Произошла ошибка входа: ' + data.message);
            });
        }
    });
});

document.querySelector('#auth-register').addEventListener('submit', (e) => {
    e.preventDefault();

    const regcode = document.querySelector('#auth-register_regcode').value;
    const username = document.querySelector('#auth-register_login').value;
    const password = document.querySelector('#auth-register_password').value;
    const role = document.querySelector('#auth-register_password').checked ? 'operator' : 'user';


    fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
    })
    .then(res => {
        if (res.ok) {
            res.json().then(data => {
                alert(data.message);
                toggleLoginRegister();
            });
        }
        else {
            res.json().then(data => {
                alert('Произошла ошибка регистрации: ' + data.message);
            });
        }
    });
});
