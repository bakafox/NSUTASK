const express = require('express');
const router = express.Router();

const boardsController = require('../controllers/boards.controller');
const authDV = require('../authDV');



router.get('/boards', authDV.validate_user, boardsController.getUserBoards);
router.get('/board:board_id', authDV.validate_user, boardsController.getBoardInfo);

router.post('/boards', authDV.validate_operator, boardsController.createBoard);
router.put('/board:board_id', authDV.validate_operator, boardsController.editBoardInfo);
router.delete('/board:board_id', authDV.validate_operator, boardsController.deleteBoard);



module.exports = router;
