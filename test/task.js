const chai = require('chai');
const chaihttp = require('chai-http');
const server = require('../index');

let token;

// Assertion style
chai.should();

chai.use(chaihttp);

describe('To-Do-Api', ()=>{

    // Testing all the POST routes first

    // 1. Register User

    describe('Register User',()=>{

        it('User registered succesfully',(done)=>{
            chai.request(server)
                .post('/api/v1/register')
                .send({
                    email:"harshyadav78200@gmail.com",
                    password:"1234"
                })
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(true);
                    res.body.should.have.property('user').be.a('Object');
                    res.body.should.have.property('token').be.a('String');
                done();
                })
        });

        it('Please provide all the details',(done)=>{
            chai.request(server)
                .post('/api/v1/register')
                .send({
                    email:"harshyadav78200@gmail.com",
                })
                .end((err,res)=>{
                    res.should.have.status(400);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(false);
                    res.body.should.have.property('msg').eq('Please provide all the details');
                done();
                })
        });

        it('User already exist',(done)=>{
            chai.request(server)
                .post('/api/v1/register')
                .send({
                    email:"harshyadav78200@gmail.com",
                    password:"1234"
                })
                .end((err,res)=>{
                    res.should.have.status(409);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(false);
                    res.body.should.have.property('msg').eq('User already exist');
                done();
                })
        });
    });

    // 2. Login User

    describe('Login User',()=>{

        it('user logged in succesfully',(done)=>{
            chai.request(server)
                .post('/api/v1/login')
                .send({
                    email:"harshyadav78200@gmail.com",
                    password:"1234"
                })
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(true);
                    res.body.should.have.property('user').be.a('Object');
                    token = res.body.token;
                    res.body.should.have.property('token').be.a('String');
                done();
                })
        });

        it('User not found',(done)=>{
            chai.request(server)
                .post('/api/v1/login')
                .send({
                    email:"harshyadav78200@gmail.com",
                    password:"124"
                })
                .end((err,res)=>{
                    res.should.have.status(404);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(false);
                    res.body.should.have.property('msg').eq('Please provide valid credentials');
                done();
                })
        });

        it('Please provide all the details',(done)=>{
            chai.request(server)
                .post('/api/v1/login')
                .send({
                    email:"harshyadav78200@gmail.com",
                })
                .end((err,res)=>{
                    res.should.have.status(400);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(false);
                    res.body.should.have.property('msg').eq('Please provide all the details');
                done();
                })
        });

    })

    // 3. Add Task

    describe('Add a Task',()=>{

        it('Adding a task by user',(done)=>{
            chai.request(server)
                .post('/api/v1/addTask')
                .set('token',`${token}`)
                .send({
                    task:"This is task name",
                    description:"This is task description"
                })
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(true);
                    res.body.should.have.property('task').be.a('Object');
                done();
                })
        });

        it('Please provide all the details',(done)=>{
            chai.request(server)
                .post('/api/v1/addTask')
                .set('token',`${token}`)
                .send({
                    description:"This is task description"
                })
                .end((err,res)=>{
                    res.should.have.status(400);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(false);
                    res.body.should.have.property('msg').be.eq('Please provide all the details');
                done();
                })
        });

        it('Unauthorized User',(done)=>{
            chai.request(server)
                .post('/api/v1/addTask')
                .set('token',`${token}`+'u')
                .send({
                    task:"This is task name",
                    description:"This is task description"
                })
                .end((err,res)=>{
                    res.should.have.status(400);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(false);
                    res.body.should.have.property('msg').be.eq('User not authorized to perform the operation');
                done();
                })
        });
    })

    // 4. Edit Task

    describe('Edit a Task',()=>{

        it('Editing a task by user',(done)=>{
            chai.request(server)
                .put('/api/v1/editTask')
                .query({task_id: 2})
                .set('token',`${token}`)
                .send({
                    task:"This is updated task name",
                    description:"This is task description"
                })
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(true);
                    res.body.should.have.property('tasks').be.a('Array');
                done();
                })
        });

        it('Please provide all the details',(done)=>{
            chai.request(server)
                .put('/api/v1/editTask')
                .query({task_id: 3})
                .set('token',`${token}`)
                .send({
                    description:"This is task description"
                })
                .end((err,res)=>{
                    res.should.have.status(400);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(false);
                    res.body.should.have.property('msg').eq('Please provide all the details');
                done();
                })
        });

        it('Unauthorized User',(done)=>{
            chai.request(server)
                .put('/api/v1/editTask')
                .query({task_id: 2})
                .set('token',`${token}u`)
                .send({
                    task:"This is task name",
                    description:"This is task description"
                })
                .end((err,res)=>{
                    res.should.have.status(400);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(false);
                    res.body.should.have.property('msg').eq('User not authorized to perform the operation');
                done();
                })
        });

        it('Task with this id does not exist',(done)=>{
            chai.request(server)
                .put('/api/v1/editTask')
                .query({task_id: 30})
                .set('token',`${token}`)
                .send({
                    task:"This is task name",
                    description:"This is task description"
                })
                .end((err,res)=>{
                    res.should.have.status(404);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(false);
                    res.body.should.have.property('msg').eq('Task with this task id does not exist');
                done();
                })
        });
    })

    // 5. Get a Task

    describe('Get a Task',()=>{

        it('Get the task by id',(done)=>{
            chai.request(server)
                .get('/api/v1/getTask')
                .query({task_id: 2})
                .set('token',`${token}`)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(true);
                    res.body.should.have.property('task').be.a('Object');
                done();
                })
        });

        it('Please provide all the details',(done)=>{
            chai.request(server)
                .get('/api/v1/getTask')
                .set('token',`${token}`)
                .end((err,res)=>{
                    res.should.have.status(400);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(false);
                    res.body.should.have.property('msg').eq('Please provide all the details');
                done();
                })
        });

        it('Unauthorized User',(done)=>{
            chai.request(server)
                .get('/api/v1/getTask')
                .query({task_id: 2})
                .set('token',`${token}u`)
                .end((err,res)=>{
                    res.should.have.status(400);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(false);
                    res.body.should.have.property('msg').eq('User not authorized to perform the operation');
                done();
                })
        });
    })

    // 6. Delete a Task

    describe('Delete a Task',()=>{

        it('Delete the task',(done)=>{
            chai.request(server)
                .delete('/api/v1/deleteTask')
                .query({task_id: 2})
                .set('token',`${token}`)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(true);
                    res.body.should.have.property('msg').eq('Task deleted sucessfully');
                done();
                })
        });

        it('Please provide all the details',(done)=>{
            chai.request(server)
                .delete('/api/v1/deleteTask')
                .set('token',`${token}`)
                .end((err,res)=>{
                    res.should.have.status(400);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(false);
                    res.body.should.have.property('msg').eq('Please provide all the details');
                done();
                })
        });

        it('Unauthorized User',(done)=>{
            chai.request(server)
                .delete('/api/v1/deleteTask')
                .query({task_id: 2})
                .set('token',`${token}u`)
                .end((err,res)=>{
                    res.should.have.status(400);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(false);
                    res.body.should.have.property('msg').eq('User not authorized to perform the operation');
                done();
                })
        });

        it('Task with this id does not exist',(done)=>{
            chai.request(server)
                .delete('/api/v1/deleteTask')
                .query({task_id: 20})
                .set('token',`${token}`)
                .end((err,res)=>{
                    res.should.have.status(404);
                    res.body.should.be.a('Object');
                    res.body.should.have.property('status').eq(false);
                    res.body.should.have.property('msg').eq('Task with this id does not exist');
                done();
                })
        });

    })
    
})
