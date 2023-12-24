require(`dotenv`).config();
require(`express-async-errors`);
const express = require(`express`);
const app = express();

//  connectDB
const connectDB = require(`./db/connect`);

//  routers
const authRouter = require(`./routes/auth`);
const jobsRouter = require(`./routes/jobs`);

const notFoundMiddleware = require(`./middleware/not-found`);
const errorHandlerMiddleware = require(`./middleware/error-handler`);

const authenticateUser = require(`./middleware/authentication`);


//  security middlewares

const Helmet = require(`helmet`);
const Cors = require(`cors`);
const xssClean = require(`xss-clean`);
const expressRateLimit = require(`express-rate-limit`);

//  swagger
const swaggerUI = require(`swagger-ui-express`);
const YAML = require(`yamljs`);
const swaggerDocument = YAML.load(`./swagger.yaml`);

app.set(`trust proxy`, 1);
app.use(
  expressRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

app.use(Helmet());
app.use(Cors());
app.use(xssClean());

app.use(express.json());

app.get(`/`, (req, res) => {
  res.send(`<h1>jobs API</h1><a href="/api-docs">Documentation</a>`);
})
app.use(`/api-docs`, swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async (req, res) => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`The server is listening on port ${port}`));
    } catch (error) {
        console.log(error);
    }
}

start();

//  for security some of the most popular external middleware that helps prevent many attacks are
/*
    helmet
    cors
    xss-clean
    express-rate-limit
*/