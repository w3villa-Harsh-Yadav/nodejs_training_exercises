const jwt = require("jsonwebtoken");
global.tasks = {};
global.users = [];
global.id = 0;

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        status: false,
        msg: "Please provide all the details",
      });
    }
    let flag = false;
    
    global.users = global.users.filter((elem) => {
      if (elem.email === email) {
          flag = true;
      }
      return elem;
    });

    if(flag){
      return res.status(409).json({
        status: false,
        msg: "User already exist",
      });
    }

    global.id += 1;

    let user = {
      user_id: global.id,
      email: email,
      password:password
    };
    const token = jwt.sign(user, process.env.SECRET_KEY, {expiresIn: 60 * 10});

    global.users.push(user);
    return res.json({
      status: true,
      user: user,
      token: token,
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      msg:'Some internal error occurred',
    });
  }
};

const login = async (req, res) => {
  try {
    let user;
    const { email , password } = req.body;

    if (!email || !password) {
      return res.json({
        status: false,
        msg: 'Please provide all the details',
      });
    }

    global.users = global.users.filter((elem) => {
      if (elem.email === email && elem.password === password) {
        user = elem;
      }
      return elem;
    });
    if (!user) {
      return res.status(404).json({
        status: false,
        msg: 'Please provide valid credentials',
      });
    }
    const token = jwt.sign(user, process.env.SECRET_KEY, {expiresIn: 60 * 10});
    return res.json({
      status: true,
      user: user,
      token: token,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: false,
      msg:'Some internal error occurred'
    });
  }
};

module.exports = {
  register,
  login,
};
