const jwt = require("jsonwebtoken");

const authenticate = async (req) => {
    try {
        let user
        if (req.get("token")) {
            user = jwt.verify(req.get("token"), process.env.SECRET_KEY);
            return user;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

module.exports = {
    authenticate,
}
