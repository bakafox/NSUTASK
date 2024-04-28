const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authDV = require('../authDV');
const DB = require('../databases');



router.login = (req, res) => {
    const { username, password } = req.body;
    const db = DB.getUsers();

    db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        (err, row) => {
            if (err) { return res.status(500).json({ message: err.message }); }
            if (!row) { return res.status(404).json({ message: 'Такого пользователя не существует.' }); }

            // Сравниваем хэши паролей
            bcrypt.compare(password, row.password, (err, isMatch) => {
                if (err) { return res.status(500).json({ message: err.message }); }
                if (!isMatch) { return res.status(401).json({ message: 'Неверный пароль.' }); }

                const session_token = jwt.sign({ id: row.id, username: row.username }, authDV.AUTH_SECRET, { expiresIn: authDV.AUTH_EXPIRATION });

                return res.status(200).json({
                    message: 'Вы вошли в систему.',
                    session_token
                });
            });
        }
    );
};

router.register = (req, res) => {
    const { username, password, role } = req.body;
    if (!authDV.ALLOW_CREATING_OPERATORS) { role = 'user'; }
    const db = DB.getUsers();

    bcrypt.hash(password, 10, (err, hash) => {
        db.run(
            `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
            [username, hash, role],
            function(err) {
                if (err) { return res.status(500).json({ message: err.message }); }

                if (role === 'operator') {
                    return res.status(201).json({ message: 'Учётная запись оператора успешно добавлена.' });
                }
                else {
                    return res.status(201).json({ message: 'Добро пожаловать в NSUTASK!' });
                }
            }
        );
    });
};



module.exports = router;
