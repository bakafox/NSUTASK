const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const DB = require('../databases');



router.getBoardTasks = (req, res) => {
    const userId = req.user.id, boardId = req.params.board_id;
    const boardsDb = DB.getBoards(), dataDb = DB.getBoardData(boardId);
    
    boardsDb.get(
        `SELECT * FROM board_members WHERE board_id = ? AND user_id = ?`,
        [boardId, userId],
        (err, row) => {
            if (err) { return res.status(500).json({ message: err.message }); }
            if (!row) { return res.status(404).json({ message: 'Такой доски не существует, либо вы не являетесь её участником.' }); }

            dataDb.all(
                `SELECT * FROM tasks`,
                (err, rows) => {
                    if (err) { return res.status(500).json({ message: err.message }); }
        
                    return res.status(200).json(rows);
                }
            );
        }
    );
};

router.getTaskInfo = (req, res) => {
    const userId = req.user.id, boardId = req.params.board_id, taskId = req.params.task_id;
    const boardsDb = DB.getBoards(), dataDb = DB.getBoardData(boardId);
    
    boardsDb.get(
        `SELECT * FROM board_members WHERE board_id = ? AND user_id = ?`,
        [boardId, userId],
        (err, row) => {
            if (err) { return res.status(500).json({ message: err.message }); }
            if (!row) { return res.status(404).json({ message: 'Такой доски не существует, либо вы не являетесь её участником.' }); }

            dataDb.get(
                `SELECT * FROM tasks WHERE id = ?`,
                [taskId],
                (err, row) => {
                    if (err) { return res.status(500).json({ message: err.message }); }
                    if (!row) { return res.status(404).json({ message: 'Такой задачи не существует.' }); }
        
                    res.status(200).json(row);
                }
            );
        }
    );
};

router.createTask = (req, res) => {
    const boardId = req.params.board_id;
    const { title, body, dateDue, priority } = req.body;
    const boardsDb = DB.getBoards(), dataDb = DB.getBoardData(boardId);

    if (priority && (priority !== 'low' && priority !== 'normal' && priority !== 'high')) {
        return res.status(400).json({ message: 'Приоритет задачи должен быть "low", "normal" или "high".' });
    }
    const dateCreated = new Date().toISOString();
    if (dateDue && isNaN(new Date(dateDue))) {
        return res.status(400).json({ message: 'Некорретный формат даты срока выполнения.' });
    }
    if (dateDue && (new Date(dateDue) < new Date(dateCreated))) {
        return res.status(400).json({ message: 'Дата срока выполнения не может быть в прошлом.' });
    }

    boardsDb.get(
        `SELECT user_creator FROM boards WHERE id = ?`,
        [boardId],
        (err, row) => {
            if (err) { return res.status(500).json({ message: err.message }); }
            if (!row) { return res.status(404).json({ message: 'Такой доски не существует, либо вы не являетесь её участником.' }); }

            if (row.user_creator !== req.user.id) {
                return res.status(403).json({ message: 'Добавлять задачи может только создатель доски.' });
            }

            dataDb.run(
                `INSERT INTO tasks (title, body, date_created, date_due, priority) VALUES (?, ?, ?, ?, ?)`,
                [title, body, dateCreated, dateDue, priority],
                function (err) {
                    if (err) { return res.status(500).json({ message: err.message }); }
        
                    const newTaskId = this.lastID;
                    res.status(201).json({ id: newTaskId });
                }
            );
        }
    );
};

router.editTaskInfo = (req, res) => {
    const boardId = req.params.board_id, taskId = req.params.task_id;
    const { title, body, dateDue, priority } = req.body;
    const boardsDb = DB.getBoards(), dataDb = DB.getBoardData(boardId);

    if (priority && (priority !== 'low' && priority !== 'normal' && priority !== 'high')) {
        return res.status(400).json({ message: 'Приоритет задачи должен быть "low", "normal" или "high".' });
    }
    const dateCreated = new Date().toISOString();
    if (dateDue && isNaN(new Date(dateDue))) {
        return res.status(400).json({ message: 'Некорретный формат даты срока выполнения.' });
    }
    if (dateDue && (new Date(dateDue) < new Date(dateCreated))) {
        return res.status(400).json({ message: 'Дата срока выполнения не может быть в прошлом.' });
    }

    boardsDb.get(
        `SELECT user_creator FROM boards WHERE id = ?`,
        [boardId],
        (err, row) => {
            if (err) { return res.status(500).json({ message: err.message }); }
            if (!row) { return res.status(404).json({ message: 'Такой доски не существует, либо вы не являетесь её участником.' }); }

            if (row.user_creator !== req.user.id) {
                return res.status(403).json({ message: 'Изменять задачи может только создатель доски.' });
            }

            dataDb.run(
                `UPDATE tasks SET title = ?, body = ?, date_due = ?, priority = ? WHERE id = ?`,
                [title, body, dateDue, priority, taskId],
                function(err) {
                    if (err) { return res.status(500).json({ message: err.message }); }
                    if (this.changes === 0) { return res.status(404).json({ message: 'Такой задачи не существует.' }); }
        
                    return res.status(200).json({ id: taskId });
                }
            );
        }
    );
};

router.deleteTask = (req, res) => {
    const boardId = req.params.board_id, taskId = req.params.task_id;
    const boardsDb = DB.getBoards(), dataDb = DB.getBoardData(boardId);

    boardsDb.get(
        `SELECT user_creator FROM boards WHERE id = ?`,
        [boardId],
        (err, row) => {
            if (err) { return res.status(500).json({ message: err.message }); }
            if (!row) { return res.status(404).json({ message: 'Такой доски не существует, либо вы не являетесь её участником.' }); }

            if (row.user_creator !== req.user.id) {
                return res.status(403).json({ message: 'Удалять задачи может только создатель доски.' });
            }

            dataDb.run(
                `DELETE FROM tasks WHERE id = ?`,
                [taskId],
                function (err) {
                    if (err) { return res.status(500).json({ message: err.message }); }
                    if (this.changes === 0) { return res.status(404).json({ message: 'Такой задачи не существует.' }); }
        
                    return res.status(200).json({ id: taskId });
                }
            );
        }
    );
};



module.exports = router;
