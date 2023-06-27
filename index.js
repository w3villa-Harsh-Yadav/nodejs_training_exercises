const express = require('express');
const app = express();
const { route } = require('./routes/routes');

const PORT = 3000;

require('dotenv').config();
app.use(express.json());

// Routes
app.use('/api/v1',route);

module.exports = app.listen(PORT,console.log(`Server is listening on the port ${PORT}`));
