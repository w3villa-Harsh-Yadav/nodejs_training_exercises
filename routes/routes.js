const express = require('express')
const routes = express.Router();
const controller = require('../controller/user_controller')

routes.post('/register',controller.createUser);
routes.post('/login',controller.loginUser);
routes.get('/getUser',controller.getUser);


module.exports = {
    routes
}
