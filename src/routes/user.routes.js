const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');


router.post('/api/users/signup', userController.signup);
router.post('/api/users/login', userController.login);


module.exports = router;