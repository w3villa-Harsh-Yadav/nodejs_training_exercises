const { authenticate } = require("../middleware/authenticate");

const addTask = async (req, res) => {
  try {
    let singletask;

    const { task, description } = req.body;

    if (!task || !description) {
      return res.json({
        status: false,
        msg: "Please provide all the details",
      });
    }

    let user = await authenticate(req);

    if (!user) {
      return res.status(400).json({
        status: false,
        msg: "User not authorized to perform the operation",
      });
    }

    global.id += 1;
    singletask = {
      task_id: global.id,
      task: req.body.task,
      description: req.body.description,
    };
    if (user.email in global.tasks) {
      global.tasks[user.email].push(singletask);
    } else {
      global.tasks[user.email] = [singletask];
    }
    return res.json({
      status: true,
      task: singletask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      msg: "Some internal error occurred",
    });
  }
};

const editTask = async (req, res) => {
  try {
    const { task, description } = req.body;
    const { task_id } = req.query;

    let user = await authenticate(req);

    console.log(user);

    if (!user || user == null) {
      return res.status(400).json({
        status: false,
        msg: "User not authorized to perform the operation",
      });
    }

    if (!task || !description || !task_id) {
      return res.status(404).json({
        status: false,
        msg: "Please provide all the details",
      });
    }

    if (user.email in global.tasks) {
      let i = 0;
      global.tasks[user.email] = global.tasks[user.email].filter((elem) => {
        if (elem.task_id == task_id) {
          i += 1;
          elem.task = task;
          elem.description = description;
        }
        return elem;
      });

      if (i == 0) {
        return res.status(404).json({
          status: false,
          msg: `Task with task id ${task_id} does not exist`,
        });
      }

      return res.json({
        status: true,
        tasks: global.tasks[user.email],
      });
    } else {
      return res.status(404).json({
        status: false,
        msg: "This user has no tasks",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      msg: "Some internal error occurred",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { task_id } = req.query;
    let user = await authenticate(req);
    if (!user) {
      return res.status(400).json({
        status: false,
        msg: "User not authorized to perform the operation",
      });
    }
    if (!task_id) {
      return res.status(400).json({
        status: false,
        msg: "Please provide all the details",
      });
    }
    let flag = 0;
    global.tasks[user.email] = global.tasks[user.email].filter((elem) => {
      if (elem.task_id != task_id) {
        return elem;
      }
      flag += 1;
    });
    if (!flag) {
      return res.status(404).json({
        status: false,
        msg: "Task with this id does not exist",
      });
    }
    return res.json({
      status: true,
      msg: "Task deleted sucessfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      msg: "Some internal error occurred",
    });
  }
};

const getTask = async (req, res) => {
  try {
    const { task_id } = req.query;
    let user = await authenticate(req);
    if (!user) {
      return res.status(400).json({
        status: false,
        msg: "User not authorized to perform the operation",
      });
    }
    if (!task_id) {
      return res.status(400).json({
        status: false,
        msg: "Please provide all the details",
      });
    }
    let task = {};
    global.tasks[user.email] = global.tasks[user.email].filter((elem) => {
      if (elem.task_id == task_id) {
        task = elem;
      }
      return elem;
    });

    return res.json({
      status: true,
      task,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      msg: "Some internal error occurred",
    });
  }
};

module.exports = {
  getTask,
  addTask,
  editTask,
  deleteTask,
};
