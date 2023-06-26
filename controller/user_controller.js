const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const model = require('../model/model');
const { authenticate } = require("../middleware/authenticate");
const logger = require('../logger')

const createUser = async(req,res) => {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            logger.error(`Status Code: ${400} - Please provide all the details. - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({
                status:false,
                msg:'Please provide all the details'
            });
        }


        let user = await model.find({email:email});

        if(user.length != 0){
            logger.error(`Status Code: ${409} - User already exist - ${req.originalUrl} - ${req.method} - ${req.ip}`);
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

        logger.info(`Status Code: ${201} - User created successfully - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        return res.status(201).json({
            status:true,
            msg:'User created successfully',
            user: user,
            token:token
        })


    } catch (error) {
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
}

const loginUser = async(req,res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            logger.error(`Status Code: ${400} - Please provide all the details. - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({
                status:false,
                msg:'Please provide all the details'
            });
        }

        let user = await model.find({email:email});

        if(user.length == 0){
            logger.error(`Status Code: ${409} - User does not exist - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(409).json({
                status:false,
                msg:'User does not exist'
            })
        }

        let verified = await bcrypt.compare(password, user[0].password);

        if(!verified){
            logger.error(`Status Code: ${403} - Invalid credentials - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(403).json({
                status:false,
                msg: 'Invalid credentials.'
            })
        }

        const token = jwt.sign({username:user[0].username,email:user[0].email},process.env.SECRET_KEY);

        logger.info(`Status Code: ${200} - Logged In successfully - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        return res.json({
            status:true,
            msg:'Logged In successfully',
            user: user,
            token: token
        })
    } catch (error) {
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
}


const getUser = async(req,res) => {
    try {

        let user = await authenticate(req);

        if(user == null){
            logger.info(`Status Code: ${400} - User not authorized to perform the operation - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({
                status: false,
                msg: 'User not authorized to perform the operation',
            });
        }

        logger.info(`Status Code: ${200} - Logged In successfully - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        return res.json({
            status:true,
            user:user
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }

}

module.exports = {
    createUser,
    loginUser,
    getUser
}
