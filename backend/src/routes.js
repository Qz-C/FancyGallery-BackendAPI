const express = require('express');
const usersController = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');

const route = express.Router();

route.post('/register', usersController.create);
route.post('/authenticate', usersController.session);
route.put('/user/update/name', authMiddleware, usersController.updateName);
route.put('/user/update/password', authMiddleware, usersController.updatePassword);
route.delete('/user/delete', authMiddleware, usersController.delete);

module.exports = route;