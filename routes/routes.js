const express = require('express')
const routes = express.Router();
const controller = require('../controller/user_controller')

routes.post('/register',controller.createuser);
routes.post('/login',controller.loginuser);

module.exports = {
    routes
}
