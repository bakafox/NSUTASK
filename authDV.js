const express = require('express');
const jwt = require('jsonwebtoken');

const DB = require('./databases');



// ПЕРМЕННЫЕ КОНФИГУРАЦИИ
ALLOW_CREATING_OPERATORS = true; // Если false, значение поля 'role' будет переопределяться на 'user'
AUTH_SECRET = '12345678901234567890'; // Используется JWT для шифровки токенов
AUTH_EXPIRATION = '24h'; // Устанавливает время действия токена

if (ALLOW_CREATING_OPERATORS) { console.warn('[!!!] Разрешено несанкционированное создание операторов.'); }



// НЕ MIDDLEWARE (вызываются в controllers или других модулях)
function checkUserRole(req) {
    const token_raw = req.headers['authorization'];
    //console.log(token_raw);
    if (!token_raw) { return res.status(401).json({ message: 'Пожалуйста, авторизируйтесь.' }); }

    const token = token_raw.split(' ')[1];

    return jwt.verify(token, AUTH_SECRET, (err, user) => {
        if (err) { return res.status(401).json({ message: 'Этот токен сессии устарел или недействителен.' }); }

        const usersDb = DB.getUsers();
        usersDb.get(
            `SELECT role FROM users WHERE id = ?`,
            [user.id],
            (err, row) => {
                if (err) { return res.status(500).json({ message: err.message }); }

                const test = row.role;
                return test;
            }
        )
    })
}



// MIDDLEWARE (встравивается в routes)
function validateUser(req, res, next) {
    const token_raw = req.headers['authorization'];
    //console.log(token_raw);
    if (!token_raw) { return res.status(401).json({ message: 'Пожалуйста, авторизируйтесь.' }); }

    const token = token_raw.split(' ')[1];

    jwt.verify(token, AUTH_SECRET, (err, user) => {
        if (err) { return res.status(401).json({ message: 'Этот токен сессии устарел или недействителен.' }); }

        req.user = user;
        next();
    });
}

function validateOperator(req, res, next) {
    validateUser(req, res, () => {
        // Мы НЕ ХРАНИМ роль пользователя в токене сессии из соображений безопасности,
        // поэтому проверка осуществляется прямо в базе данных. Медленнее, зато безопаснее!
        const usersDb = DB.getUsers();

        usersDb.get(
            `SELECT * FROM users WHERE id = ? AND role = 'operator'`,
            [req.user.id],
            (err, row) => {
                if (err) { return res.status(500).json({ message: err.message }); }
                if (!row) { return res.status(403).json({ message: 'У вас нет прав для выполнения этого действия.' }); }

                next();
            }
        );
    });
}



module.exports = {
    ALLOW_CREATING_OPERATORS,
    AUTH_SECRET,
    AUTH_EXPIRATION,
    checkUserRole,
    validateUser,
    validateOperator
}
