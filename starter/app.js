const express = require(`express`);
const app = express();
const tasks = require(`./routes/tasks`);
const connectDB = require(`./db/connect`);

require(`dotenv`).config();

//  mddleware for json
app.use(express.static(`./public`));
app.use(express.json());

const port = 5000;
app.use(`/api/v1/tasks`, tasks); 

//  invoke the connectDB here
//  because connectDB returns a promise, we use async await to invoke it

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is listening at port ${port}...`));
    } 
    catch (error) {
        console.log(error);
    }
}

//  Calling the start function
start();
