const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks.controller');



router.post('/create', tasksController.createTask);
router.get('/list', tasksController.getTasks);
router.post('/update-completion', tasksController.updateTaskCompletion);



module.exports = router;
