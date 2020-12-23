const express = require('express');
const usersController = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const imgController = require('./controllers/img');
const multerConfig = require('./config/multer');
const multer = require('multer');

const route = express.Router();

route.post('/user/register', usersController.create);
route.post('/user/authenticate', usersController.session);
route.put('/user/updatename', authMiddleware, usersController.updateName);
route.put('/user/updatepassword', authMiddleware, usersController.updatePassword);
route.delete('/user/delete', authMiddleware, usersController.delete);

route.post('/img/upload', authMiddleware, multer(multerConfig).single('file'), imgController.upload);
route.put('/img/updatename', authMiddleware, imgController.updateName);
route.delete('/img/delete', authMiddleware, imgController.delete);
route.get('/img/list', authMiddleware, imgController.list);
route.get('/img/download', authMiddleware, imgController.download);
route.get('/user/get', authMiddleware, usersController.getUser);

module.exports = route;