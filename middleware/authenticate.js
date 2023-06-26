const jwt = require("jsonwebtoken");
const model = require('../model/model');
const logger = require('../logger')


const authenticate = async (req) => {
    try {
        let user;
        const token = req.get("token")
        if (token) {
            user = jwt.verify(token, process.env.SECRET_KEY);
            user = await model.find({email: user.email});
            logger.info(`Status Code: ${201} - User: ${user[0]} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return user[0];
        }
        return null;
    } catch (error) {
        logger.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return null;
    }
};

module.exports = {
    authenticate,
}
