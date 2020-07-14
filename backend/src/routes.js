const express = require('express');
const usersController = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const imgController = require('./controllers/img');
const multerConfig = require('./config/multer');
const multer = require('multer');

const route = express.Router();

route.post('/register', usersController.create);
route.post('/authenticate', usersController.session);
route.put('/user/update/name', authMiddleware, usersController.updateName);
route.put('/user/update/password', authMiddleware, usersController.updatePassword);
route.delete('/user/delete', authMiddleware, usersController.delete);

route.post('/upload', authMiddleware, multer(multerConfig).single("img"), imgController.upload);
route.put('/img/update/name', authMiddleware, imgController.updateName);
route.delete('/img/delete', authMiddleware, imgController.delete);
route.get('/img/list', authMiddleware, imgController.list);



module.exports = route;