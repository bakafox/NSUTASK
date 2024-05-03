const express = require('express');
const app = express();
const path = require('path');



app.use(express.json()); // Middleware для парсинга JSON

app.use(express.static('public')); // Middleware для статичных веб-страничек



const usersRoute = require('./routes/users.route');
app.use('/api/', usersRoute); // api/users ИЛИ api/userABC

const boardsRoute = require('./routes/boards.route');
app.use('/api/', boardsRoute); // api/boards ИЛИ api/boardABC

const tasksRoute = require('./routes/tasks.route');
app.use('/api/', tasksRoute); // api/boardABC/tasks ИЛИ api/boardABC/taskIJK

const submitRoute = require('./routes/submits.route');
app.use('/api/', submitRoute); // api/boardABC/taskIJK/submit ИЛИ api/boardABC/taskIJK/submitXYZ



app.use('/', express.static(path.join(__dirname, 'public/tasklist')));
app.use(['/login', '/register', '/auth'], express.static(path.join(__dirname, 'public/users')));
app.use('/shared', express.static(path.join(__dirname, 'public/shared')));
//app.use('/auth', express.static(path.join(__dirname, 'public/if-auth')));
//app.use('/config', express.static(path.join(__dirname, 'public/if-config')));



// Дополнительные команды для дебага добавляьт ВНУТРЬ функции!
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Проект запущен на порту ${PORT}...`);
});
