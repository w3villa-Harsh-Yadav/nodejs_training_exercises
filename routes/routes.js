const express = require('express')
const routes = express.Router();
const controller = require('../controller/user_controller')

routes.post('/register',controller.createuser);
routes.post('/login',controller.loginuser);
routes.get('/getUser',controller.getuser);
routes.put('/updateUser',controller.updateuser);
routes.delete('/deleteUser',controller.deleteuser);

module.exports = {
    routes
}
