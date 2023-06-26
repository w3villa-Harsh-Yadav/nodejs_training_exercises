require('dotenv').config();
const express = require('express');
const app = express();

const connectDB = require('./db/db');
const { routes } = require('./routes/routes')
const logger = require('./logger')

const PORT = 3000 || process.env.PORT;

app.use(express.json());

app.use('/api/v1',routes);

app.use('/*',(req,res)=>{
    res.status(404).json({
        status:false,
        msg:'Please enter valid url'
    });
    logger.error(`Status Code: ${res.statusCode || 500} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
});

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT,console.log(`Sever is listening on the port ${PORT}`));
    } catch (error) {
        logger.error(`Status Code: ${error.status || 500} - ${error.message}`);
    }
}
start();
