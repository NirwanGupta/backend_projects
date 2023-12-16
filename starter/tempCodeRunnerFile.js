const express = require(`express`);
const app = express();
const tasks = require(`./routes/tasks`);
const connectDB = require(`./db/connect`);

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const notFound = require(`./middleware/not-found`);
const errorHandlerMiddleware = require('./middleware/error-handler');

//  mddleware for json

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
// app.use(express.static(`./public`));
app.use(express.json());

// app.use(express.static('./public'));
// app.use(`/api/v1/tasks`, tasks);

const port = 5000;
app.use(`/api/v1/tasks`, tasks); 
app.use(notFound);
app.use(errorHandlerMiddleware);

//  invoke the connectDB here
//  because connectDB returns a promise, we use async await to invoke it

const start = async () => {
    try {
        // console.log(process.env.MONGO_URI);
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is listening at port ${port}...`));
    } 
    catch (error) {
        console.log(error);
    }
}

//  Calling the start function
start();