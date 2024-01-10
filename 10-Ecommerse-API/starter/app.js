require(`dotenv`).config();
require(`express-async-errors`);    //  to avoid unnecessary try catches

const express = require(`express`);
const app = express();

const morgan = require(`morgan`);
const cookieParser = require(`cookie-parser`);  //  this middleware puts the cookie in the req
const fileUpload = require('express-fileupload');

const connectDB = require(`./db/connect`);
const authRouter = require(`./router/authRouter`);
const userRouter = require(`./router/userRoutes`);
const productRouter = require(`./router/productRoutes`);
const reviewRouter = require(`./router/reviewRoutes`);
const orderRouter = require(`./router/orderRouter`);

const errorHandlerMiddleware = require(`./middleware/error-handler`);
const notFoundMiddleware = require(`./middleware/not-found`);

app.use(morgan(`tiny`));    //  useful to know at any call that which route we are heading
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static(`./public`));
app.use(fileUpload());

app.get(`/`, (req, res) => {
    res.send(`Home page`);
})

app.get(`/api/v1`, (req, res) => {
    // console.log(req.cookies);    //  this works if cookie is not signed
    console.log(req.signedCookies);     //  this works for signed cookie
    res.send(`Home page /api/v1`);
})

app.use(`/api/v1/auth`, authRouter);
app.use('/api/v1/users', userRouter);
app.use(`/api/v1/products`, productRouter);
app.use(`/api/v1/reviews`, reviewRouter);
app.use(`/api/v1/orders`, orderRouter);

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