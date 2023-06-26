const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const model = require('../model/model');


const createuser = async(req,res) => {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            return res.status(400).json({
                status:false,
                msg:'Please provide all the details'
            });
        }

        let user = await model.find({email:email});

        if(user.length != 0){
            return res.status(409).json({
                status:false,
                msg:'User already exist'
            })
        }

        const token = jwt.sign({username:username,email:email},process.env.SECRET_KEY);

        let hash_password = await bcrypt.hash(password, saltRounds);

        user = await model.create({
            username:username,
            email:email,
            password:hash_password
        })

        return res.status(201).json({
            status:true,
            msg:'User created successfully',
            user: user,
            token:token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
    }
}

const loginuser = async(req,res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({
                status:false,
                msg:'Please provide all the details'
            });
        }

        let user = await model.find({email:email});

        if(user.length == 0){
            return res.status(409).json({
                status:false,
                msg:'User does not exist'
            })
        }

        let verified = await bcrypt.compare(password, user[0].password);

        if(!verified){
            return res.status(403).json({
                status:false,
                msg: 'Invalid credentials.'
            })
        }

        const token = jwt.sign({username:user[0].username,email:user[0].email},process.env.SECRET_KEY);

        return res.json({
            status:true,
            msg:'Logged In successfully',
            user: user,
            token: token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
    }
}

module.exports = {
    createuser,
    loginuser
}
