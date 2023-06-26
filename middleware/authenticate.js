const jwt = require("jsonwebtoken");
const model = require('../model/model');

const authenticate = async (req) => {
    try {
        let user;
        const token = req.get("token")
        if (token) {
            user = jwt.verify(token, process.env.SECRET_KEY);
            user = await model.find({email: user.email});
            console.log(user)

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
