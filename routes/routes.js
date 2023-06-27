const express = require('express');
const route = express.Router();

const user_controller = require('../controller/user_controller');
const task_controller = require('../controller/task_controller');

// User routes
route.post('/register',user_controller.register)
route.post('/login',user_controller.login)

// Task routes
route.post('/addTask',task_controller.addTask);
route.get('/getTask',task_controller.getTask);
route.put('/editTask',task_controller.editTask);
route.delete('/deleteTask',task_controller.deleteTask);

module.exports = {
    route
}
