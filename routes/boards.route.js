const express = require('express');
const router = express.Router();

const boardsController = require('../controllers/boards.controller');
const authDV = require('../authDV');



router.get('/boards', authDV.validateUser, boardsController.getUserBoards);
router.get('/board:board_id', authDV.validateUser, boardsController.getBoardInfo);

router.post('/boards', authDV.validateOperator, boardsController.createBoard);
router.put('/board:board_id', authDV.validateOperator, boardsController.editBoardInfo);
router.delete('/board:board_id', authDV.validateOperator, boardsController.deleteBoard);

router.get('/board:board_id/users', authDV.validateOperator, boardsController.getMembers);
router.post('/board:board_id/user:user_id', authDV.validateOperator, boardsController.addMember);
router.delete('/board:board_id/user:user_id', authDV.validateOperator, boardsController.deleteMember);



module.exports = router;
