const express = require('express');
const usersController = require('./controllers/users');

const route = express.Router();

route.post('/register', usersController.create);

module.exports = route;