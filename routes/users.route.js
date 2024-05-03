const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller');
const authDV = require('../authDV');



router.post('/users/login', usersController.login);
router.post('/users/register', usersController.register);

router.get('/users', authDV.validateUser, usersController.getUsers);
router.get('/user:user_id', authDV.validateUser, usersController.getUser);
router.get('/findUsers', authDV.validateOperator, usersController.findUsers);



module.exports = router;
