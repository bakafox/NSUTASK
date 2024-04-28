const express = require('express');
const router = express.Router();

const tasksController = require('../controllers/tasks.controller');
const authDV = require('../authDV');



router.get('/board:board_id/tasks', authDV.validate_user, tasksController.getBoardTasks);
router.get('/board:board_id/task:task_id', authDV.validate_user, tasksController.getTaskInfo);

router.post('/board:board_id/tasks', authDV.validate_operator, tasksController.createTask);
router.put('/board:board_id/task:task_id', authDV.validate_operator, tasksController.editTaskInfo);
router.delete('/board:board_id/task:task_id', authDV.validate_operator, tasksController.deleteTask);



module.exports = router;
