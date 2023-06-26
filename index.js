require('dotenv').config();
const express = require('express');
const app = express();

const connectDB = require('./db/db');
const { routes } = require('./routes/routes')

const PORT = 3000 || process.env.PORT;

app.use(express.json());
app.use('/api/v1',routes);

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT,console.log(`Sever is listening on the port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}
start();
