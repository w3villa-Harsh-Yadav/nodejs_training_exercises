const model = require('../model/model');
const jwt = require('jsonwebtoken');
const { authenticate } = require("../middleware/authenticate");

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

        user = await model.create({
            username:username,
            email:email,
            password:password
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

const getuser = async(req,res) => {
    try {
        let user = await authenticate(req);

        if(user == null){
            return res.status(400).json({
                status: false,
                msg: 'User not authorized to perform the operation',
            });
        }

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
    }

}

const updateuser = async(req,res) => {
    try {

        let { username, email, password } = req.body;

        let user = await authenticate(req);

        if(user == null){
            return res.status(400).json({
                status: false,
                msg: 'User not authorized to perform the operation',
            });
        }

        let flag = 0;

        if(username && email && password){
            user.username = username;
            user.email = email;
            user.password = password;
            flag+=1;
        }

        if(username){
            user.username = username;
            flag+=1;
        }
        if(email){
            user.email = email;
            flag+=1;
        }
        if(password){
            user.password = password;
            flag+=1;
        }

        if(flag == 0){
            return res.json({
                status:true,
                msg:'Nothing updated'
            })
        }

        await user.save();

        return res.json({
            status:true,
            msg: 'User updated succesfully'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
    }

}

const deleteuser = async(req,res) => {
    try {
        let user = await authenticate(req);

        if(user == null){
            return res.status(400).json({
                status: false,
                msg: 'User not authorized to perform the operation',
            });
        }

        let deleted_user = await model.findByIdAndRemove(user.id);

        return res.json({
            status:true,
            msg:'User deleted succesfully',
            user: deleted_user
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
    loginuser,
    getuser,
    updateuser,
    deleteuser
}
