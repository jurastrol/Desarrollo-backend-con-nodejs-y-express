const express = require('express');
const { isAuth, isValidHostname } = require('../../middlewares/auth');
const usersController = require('../../controllers/v1/users-controller');

const router = express.Router();

router.post('/login', usersController.login);
router.post('/create', usersController.createUser);
router.post('/update', isValidHostname, isAuth, usersController.updateUser);
router.post('/delete', isAuth, usersController.deleteUser);
router.get('/get-all', usersController.getUsers);

module.exports = router;
