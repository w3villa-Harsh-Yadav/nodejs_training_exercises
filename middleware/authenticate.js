const jwt = require("jsonwebtoken");
const model = require('../model/model');
const { checkInCache } = require("../middleware/cache");

const authenticate = async (req,cache) => {
    try {
        let user;
        const token = req.get("token")
        if (token) {
            user = jwt.verify(token, process.env.SECRET_KEY);
            const key = user.email+user.password;
            console.log(key)
            let response = await checkInCache(cache,key);
            console.log(response);
            if(response){
                return response;
            }
            user = await model.find({email: user.email});
            return user[0];
        }
        return null;
    } catch (error) {
        return null;
    }
};

module.exports = {
    authenticate,
}
