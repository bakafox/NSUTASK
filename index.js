const express = require('express');
const app = express();
const path = require('path');



app.use(express.json()); // Middleware для парсинга JSON

app.use(express.static('public')); // Middleware для статичных веб-страничек



const authRoute = require('./routes/auth.route');
app.use('/api/auth', authRoute); // api/auth

const boardsRoute = require('./routes/boards.route');
app.use('/api/', boardsRoute); // api/boardABC

const tasksRoute = require('./routes/tasks.route');
app.use('/api/', tasksRoute); // api/boardABC/taskXYZ



app.use('/', express.static(path.join(__dirname, 'public/tasklist')));
app.use(['/login', '/register', '/auth'], express.static(path.join(__dirname, 'public/auth')));
app.use('/shared', express.static(path.join(__dirname, 'public/shared')));
//app.use('/auth', express.static(path.join(__dirname, 'public/if-auth')));
//app.use('/config', express.static(path.join(__dirname, 'public/if-config')));



// Дополнительные команды для дебага добавляьт ВНУТРЬ функции!
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Проект запущен на порту ${PORT}...`);
});
