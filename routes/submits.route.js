const express = require('express');
const router = express.Router();

const submitsController = require('../controllers/submits.controller');
const authDV = require('../authDV');



router.get('/board:board_id/task:task_id/submit', authDV.validateUser, submitsController.getSubmitInfo);
router.post('/board:board_id/task:task_id/submit', authDV.validateUser, submitsController.createSubmit);
router.delete('/board:board_id/task:task_id/submit', authDV.validateUser, submitsController.deleteSubmit);

router.get('/board:board_id/task:task_id/submits', authDV.validateOperator, submitsController.getTaskSubmits);
router.put('/board:board_id/task:task_id/submit:submit_id', authDV.validateOperator, submitsController.setSubmitStatus);



module.exports = router;
