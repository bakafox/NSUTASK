const express = require('express');
const router = express.Router();
const fs = require('fs');

const sqlite3 = require('sqlite3').verbose();
const DB = require('../databases');



// МЕТОДЫ НИЖЕ ТРЕБУЮТ ПРЕВИЛЕГИЙ ПОЛЬЗОВАТЕЛЯ
router.getUserBoards = (req, res) => {
    const userId = req.user.id;
    const db = DB.getBoards();

    db.all(
        `SELECT board_id FROM board_members WHERE user_id = ?`,
        [userId],
        (err, rows) => {
            if (err) { return res.status(500).json({ message: err.message }); }

            return res.status(200).json(rows.map(row => row.board_id));
        }
    );
};

router.getBoardInfo = (req, res) => {
    const userId = req.user.id, boardId = req.params.board_id;
    const db = DB.getBoards();

    db.get(
        `SELECT * FROM board_members WHERE board_id = ? AND user_id = ?`,
        [boardId, userId],
        (err, row) => {
            if (err) { return res.status(500).json({ message: err.message }); }
            if (!row) { return res.status(404).json({ message: 'Такой доски не существует, либо вы не являетесь её участником.' }); }

            db.get(
                `SELECT * FROM boards WHERE id = ?`,
                [boardId],
                (err, row) => {
                    if (err) { return res.status(500).json({ message: err.message }); }
        
                    db.get(
                        `SELECT * FROM board_configs WHERE board_id = ?`,
                        [boardId],
                        (err, row2) => {
                            if (err) { return res.status(500).json({ message: err.message }); }
        
                            return res.status(200).json({ board: row, config: row2 });
                        }
                    )
                }
            );
        }
    );
};



// МЕТОДЫ НИЖЕ ТРЕБУЮТ ПРЕВИЛЕГИЙ ОПЕРАТОРА
router.createBoard = (req, res) => {
    const userId = req.user.id;
    let { name, description, configSubmitsAutoaccept, configSubmitsBodySize, configSubmitsStrictDueDate } = req.body;
    const db = DB.getBoards();
    
    // В SQLite нет оператора BOOLEAN, официальная документация говорит
    // хранить их как INTEGER со значением 0 или 1... легковесненько.
    if (!configSubmitsAutoaccept) { configSubmitsAutoaccept = 0; }
    if (!configSubmitsBodySize) { configSubmitsBodySize = 1; }
    if (!configSubmitsStrictDueDate) { configSubmitsStrictDueDate = 0; }

    db.run(
        `INSERT INTO boards (name, description, user_creator) VALUES (?, ?, ?)`,
        [name, description, userId],
        function (err) {
            if (err) { return res.status(500).json({ message: err.message }); }

            const newBoardId = this.lastID;
            db.run(
                `INSERT INTO board_configs (board_id, submits_autoaccept, submits_body_size, submits_strict_due_date) VALUES (?, ?, ?, ?)`,
                [newBoardId, configSubmitsAutoaccept, configSubmitsBodySize, configSubmitsStrictDueDate],
                (err) => {
                    if (err) { return res.status(500).json({ message: err.message }); }

                    db.run(
                        `INSERT INTO board_members (board_id, user_id) VALUES (?, ?)`,
                        [newBoardId, userId],
                        (err) => {
                            if (err) { return res.status(500).json({ message: err.message }); }

                            try {
                                fs.mkdirSync('./data/boards/' + newBoardId, { recursive: true });
                            }
                            catch (err) {
                                console.error(`[XXX] Не удалось создать директорию доски ${newBoardId}!`);
                            }

                            return res.status(201).json({ id: newBoardId });
                        }
                    );
                }
            );
        }
    );
};

router.editBoardInfo = (req, res) => {
    const userId = req.user.id, boardId = req.params.board_id;
    let { name, description, configSubmitsAutoaccept, configSubmitsBodySize, configSubmitsStrictDueDate } = req.body;
    const db = DB.getBoards();

    if (!configSubmitsAutoaccept) { configSubmitsAutoaccept = 0; }
    if (!configSubmitsBodySize) { configSubmitsBodySize = 1; }
    if (!configSubmitsStrictDueDate) { configSubmitsStrictDueDate = 0; }

    db.get(
        `SELECT * FROM board_members WHERE board_id = ? AND user_id = ?`,
        [boardId, userId],
        (err, row) => {
            if (err) { return res.status(500).json({ message: err.message }); }
            if (!row) { return res.status(404).json({ message: 'Такой доски не существует, либо вы не являетесь её участником.' }); }

            db.run(
                `UPDATE boards SET name = ?, description = ? WHERE id = ?`,
                [name, description, boardId],
                function (err) {
                    if (err) { return res.status(500).json({ message: err.message }); }
                    if (this.changes === 0) { return res.status(404).json({ message: 'Такой доски не существует.' }); }
        
                    db.run(
                        `UPDATE board_configs SET submits_autoaccept = ?, submits_body_size = ?, submits_strict_due_date = ? WHERE board_id = ?`,
                        [configSubmitsAutoaccept, configSubmitsBodySize, configSubmitsStrictDueDate, boardId],
                        function (err) {
                            if (err) { return res.status(500).json({ message: err.message }); }
                            if (this.changes === 0) { return res.status(404).json({ message: 'Такой доски не существует.' }); }
        
                            return res.status(200).json({ id: boardId });
                        }
                    )
                }
            );
        }
    );
};

router.deleteBoard = (req, res) => {
    const userId = req.user.id, boardId = req.params.board_id;
    const db = DB.getBoards();

    db.get(
        `SELECT * FROM board_members WHERE board_id = ? AND user_id = ?`,
        [boardId, userId],
        (err, row) => {
            if (err) { return res.status(500).json({ message: err.message }); }
            if (!row) { return res.status(404).json({ message: 'Такой доски не существует, либо вы не являетесь её участником.' }); }

            // проверяем, является ли пользователем создателем доски
            db.get(
                `SELECT * FROM boards WHERE id = ? AND user_creator = ?`,
                [boardId, userId],
                (err, row) => {
                    if (err) { return res.status(500).json({ message: err.message }); }

                    if (!row) { return res.status(403).json({ message: 'Удалить доску может только её создатель.' }); }
                }
            )

            db.run(
                `DELETE FROM boards WHERE id = ? AND user_creator = ?`,
                [boardId, userId],
                function(err) {
                    if (err) { return res.status(500).json({ message: err.message }); }
                    if (this.changes === 0) { return res.status(404).json({ message: 'Такой доски не существует.' }); }
    
                    db.run(
                        `DELETE FROM board_configs WHERE board_id = ?`,
                        [boardId],
                        (err) => {
                            if (err) { return res.status(500).json({ message: err.message }); }
    
                            db.run(
                                `DELETE FROM board_members WHERE board_id = ?`,
                                [boardId],
                                (err) => {
                                    if (err) { return res.status(500).json({ message: err.message }); }
    
                                    try {
                                        fs.rmdirSync('./data/boards/' + boardId, { recursive: true });
                                    }
                                    catch (err) {
                                        console.error(`[XXX] Не удалось удалить директорию доски ${boardId}!`);
                                    }
    
                                    return res.status(201).json({ id: boardId });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};

router.getMembers = (req, res) => {
    const userId = req.user.id, boardId = req.params.board_id;
    const boardsDb = DB.getBoards();

    boardsDb.get(
        `SELECT * FROM board_members WHERE board_id = ? AND user_id = ?`,
        [boardId, userId],
        (err, row) => {
            if (err) { return res.status(500).json({ message: err.message }); }
            if (!row) { return res.status(404).json({ message: 'Такой доски не существует, либо вы не являетесь её участником.' }); }

            boardsDb.all(
                `SELECT * FROM board_members WHERE board_id = ?`,
                [boardId],
                (err, rows) => {
                    if (err) { return res.status(500).json({ message: err.message }); }

                    return res.status(200).json(rows.map(row => row.user_id));
                }
            );
        }
    );
}

router.addMember = (req, res) => {
    const userId = req.user.id, boardId = req.params.board_id, memberId = req.params.user_id;
    const boardsDb = DB.getBoards(), usersDb = DB.getUsers();

    boardsDb.get(
        `SELECT * FROM board_members WHERE board_id = ? AND user_id = ?`,
        [boardId, userId],
        (err, row) => {
            if (err) { return res.status(500).json({ message: err.message }); }
            if (!row) { return res.status(404).json({ message: 'Такой доски не существует, либо вы не являетесь её участником.' }); }

            boardsDb.get(
                `SELECT * FROM board_members WHERE board_id = ? AND user_id = ?`,
                [boardId, memberId],
                (err, row) => {
                    if (err) { return res.status(500).json({ message: err.message }); }
                    if (row) { return res.status(400).json({ message: 'Этот пользователь уже является участником этой доски.' }); }

                    usersDb.get(
                        `SELECT id FROM users WHERE id = ?`,
                        [memberId],
                        (err, row) => {
                            if (err) { return res.status(500).json({ message: err.message }); }
                            if (!row) { return res.status(404).json({ message: 'Такого пользователя не существует.' }); }

                            boardsDb.run(
                                `INSERT INTO board_members (board_id, user_id) VALUES (?, ?)`,
                                [boardId, memberId],
                                function(err) {
                                    if (err) { return res.status(500).json({ message: err.message }); }

                                    return res.status(201).json({ id: memberId });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};

router.deleteMember = (req, res) => {
    const userId = req.user.id, boardId = req.params.board_id, memberId = req.params.user_id;
    const boardsDb = DB.getBoards(), usersDb = DB.getUsers();

    if (memberId == userId) {
        return res.status(400).json({ message: 'Вы не можете удалить самого себя!' });
    }

    boardsDb.get(
        `SELECT * FROM board_members WHERE board_id = ? AND user_id = ?`,
        [boardId, userId],
        (err, row) => {
            if (err) { return res.status(500).json({ message: err.message }); }
            if (!row) { return res.status(404).json({ message: 'Такой доски не существует, либо вы не являетесь её участником.' }); }

            usersDb.get(
                `SELECT id FROM users WHERE id = ?`,
                [memberId],
                (err, row) => {
                    if (err) { return res.status(500).json({ message: err.message }); }
                    if (!row) { return res.status(404).json({ message: 'Такого пользователя не существует.' }); }


                    boardsDb.run(
                        `DELETE FROM board_members WHERE board_id = ? AND user_id = ?`,
                        [boardId, memberId],
                        function(err) {
                            if (err) { return res.status(500).json({ message: err.message }); }

                            return res.status(200).json({ id: memberId });
                        }
                    );
                }
            );
        }
    );
};



module.exports = router;
