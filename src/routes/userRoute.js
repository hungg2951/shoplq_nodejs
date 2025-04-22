const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { checkPermission } = require('../middlewares/authorization');

router.get('/users',checkPermission("admin"), userController.getUsers);
router.get('/user/:id', userController.getUserById);
router.patch('/user',checkPermission("admin"), userController.updateUser);
router.delete('/user/:id',checkPermission("admin"), userController.deleteUser);

module.exports = router;
