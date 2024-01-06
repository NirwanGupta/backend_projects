require(`dotenv`).config();
require(`express-async-errors`);    //  to avoid unnecessary try catches

const express = require(`express`);
const app = express();

const morgan = require(`morgan`);

const connectDB = require(`./db/connect`);
const authRouter = require(`./router/authRouter`);

const errorHandlerMiddleware = require(`./middleware/error-handler`);
const notFoundMiddleware = require(`./middleware/not-found`);

app.use(morgan(`tiny`));    //  useful to know at any call that which route we are heading
app.use(express.json());

app.get(`/`, (req, res) => {
    res.send(`Home page`);
})

app.use(`/api/v1/auth`, authRouter);

app.use(notFoundMiddleware);    //  if we try to access routes that are not covered we want 404, and once we reach 404, we want all functionality to stop, thus no next() in NotFoiund
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is listening on port ${port}`));
    } catch (error) {
        console.log(error);
    }
}

start();