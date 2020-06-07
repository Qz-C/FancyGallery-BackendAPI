const express = require('express');
const usersController = require('./controllers/users');

const route = express.Router();

route.post('/register', usersController.create);
route.post('/authenticate', usersController.session);

module.exports = route;