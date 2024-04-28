const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');



function getBoardDatabase(board) {
    if (!fs.existsSync('./data/boards.sqlite')) {
        console.warn('[!!!] Отстуствует база данных всех досок.');
    }
    const db_boards = new sqlite3.Database('./data/boards.sqlite');

    db_boards.serialize(() => {
        db_boards.run(`
        CREATE TABLE IF NOT EXISTS boards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )`);
    })

    // Проверяем наличие доски в списке (пока что добавляются вручную!)
    // INSERT INTO boards (name) VALUES ('SAMPLE');
    db_boards.get(
        `SELECT * FROM boards WHERE name = ?`,
        [board],
        (err, row) => {
            if (!row) { return null; }
        }
    )
    if (!db_boards) { return null; }

    if (!fs.existsSync('./data/' + board)) {
        fs.mkdirSync('./data/' + board, { recursive: true });
    }
    
    const db_data = new sqlite3.Database('./data/' + board + '/data.sqlite');

    db_data.serialize(() => {
        db_data.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            dueDateTime TEXT NOT NULL,
            allowUserCompletion BOOLEAN NOT NULL DEFAULT 0,
            createdBy INTEGER NOT NULL,
            FOREIGN KEY (createdBy) REFERENCES users(id)
        )`);

        db_data.run(`
        CREATE TABLE IF NOT EXISTS task_completions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            taskId INTEGER NOT NULL,
            userId INTEGER NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0,
            FOREIGN KEY (taskId) REFERENCES tasks(id),
            FOREIGN KEY (userId) REFERENCES users(id)
        )`);
    });

    return db_data;
}

function getUsersDatabase() {
    if (!fs.existsSync('./data/users.sqlite')) {
        console.warn('[!!!] Отстуствует база данных пользователей.');
    }
    const db_users = new sqlite3.Database('./data/users.sqlite');

    db_users.serialize(() => {
        db_users.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user'
        )`);
    });

    return db_users;
}

function verifySession(req) {
    const db = getUsersDatabase();

    // Кука сессии повреждена или отсутствует
    if (!req.cookies.session) { return false; }

    // Пользователь не существует в БД
    db.get(
        `SELECT id FROM users WHERE id = ?`,
        [req.cookies.session],
        (err, row) => {
            if (!row) { return false; }
        }
    );

    return true;
}



router.createTask = (req, res) => {
    if (!verifySession(req)) { return res.status(401).json({ message: 'Пожалуйста, войдите в систему.' }); }
    db.get(
        `SELECT role FROM users WHERE id = ?`,
        [req.cookies.session],
        (err, row) => {
            if (row.role !== 'operator') { return res.status(403).json({ message: 'Недостаточно прав для создания задачи.' }); }
        }
    )
    
    const { title, body, dueDateTime, allowUserCompletion, createdBy } = req.body;
    const db = getBoardDatabase('SAMPLE');
    if (!db) { return res.status(404).json({ message: 'Указанная доска не существует.' }); }

    db.run(
        `INSERT INTO tasks (title, body, dueDateTime, allowUserCompletion, createdBy) VALUES (?, ?, ?, ?, ?)`,
        [title, body, dueDateTime, allowUserCompletion, createdBy],
        (err, row) => {
            if (err) { return res.status(500).json({ message: err.message }); }
            return res.json({ id: this.lastID, title, body, dueDateTime, allowUserCompletion, createdBy });
        }
    );
};

router.getTasks = (req, res) => {
    if (!verifySession(req)) { return res.status(401).json({ message: 'Пожалуйста, войдите в систему.' }); }

    const { userId, role } = req.body;
    const db = getBoardDatabase('SAMPLE');
    if (!db) { return res.status(404).json({ message: 'Указанная доска не существует.' }); }

    db.all(
        `SELECT t.*, c.completed
        FROM tasks t
        LEFT JOIN task_completions c ON t.id = c.taskId AND c.userId = ?
        ORDER BY t.id`,
        [userId],
        (err, rows) => {
        if (err) { return res.status(500).json({ message: err.message }); }

        const tasks = rows.map(row => {
        return {
            id: row.id,
            title: row.title,
            body: row.body,
            dueDateTime: row.dueDateTime,
            allowUserCompletion: row.allowUserCompletion,
            createdBy: row.createdBy,
            completed: row.completed || false
        };
        });

        if (role === 'operator') {
            db.all(`SELECT t.id, u.username, c.completed
                    FROM tasks t
                    LEFT JOIN task_completions c ON t.id = c.taskId
                    LEFT JOIN users u ON c.userId = u.id
                    ORDER BY t.id`, (err, userCompletions) => {
                if (err) { return res.status(500).json({ message: err.message }); }

                const tasksWithUserCompletions = tasks.map(task => {
                    const userCompletions = userCompletions.filter(uc => uc.id === task.id);
                    return {
                        ...task,
                        userCompletions: userCompletions.map(uc => ({ username: uc.username, completed: uc.completed }))
                        };
                });

                return res.json(tasksWithUserCompletions);
            });
        } else {
            return res.json(tasks);
        }
    });
};

router.updateTaskCompletion = (req, res) => {
    if (!verifySession(req)) { return res.status(401).json({ message: 'Пожалуйста, войдите в систему.' }); }

    const { taskId, completed, userId } = req.body;
    const db = getBoardDatabase('SAMPLE');
    if (!db) { return res.status(404).json({ message: 'Указанная доска не существует.' }); }
    
    db.run(
        `INSERT OR REPLACE INTO task_completions (taskId, userId, completed) VALUES (?, ?, ?)`,
        [taskId, userId, completed],
        (err, row) => {
            if (err) { return res.status(500).json({ message: err.message }); }
            return res.sendStatus(200);
        }
    );
};



module.exports = router;
