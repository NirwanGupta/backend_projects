require('dotenv').config();

// Async errors
require(`express-async-errors`);

const express = require('express');
const app = express();

// Importing modules
const connectDB = require('./db/connect');
const productsRouter = require('./routes/products');
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('<h1> Store API </h1><a href="api/v1/products">products route</a>');
});

app.use('/api/v1/products', productsRouter);

// Middleware for handling 404 Not Found
app.use(notFoundMiddleware);

// Middleware for handling errors
app.use(errorMiddleware);

// Set the port from the environment variable or default to 3000
const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    } catch (error) {
        console.error(error);
    }
};

start();