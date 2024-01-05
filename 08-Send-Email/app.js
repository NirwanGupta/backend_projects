require(`dotenv`).config();
require(`express-async-errors`);

const express = require(`express`);
const app = express();
const connectDB = require(`./db/connect`);

const notFound = require(`./middleware/not-found`);
const errorHandlerMiddleware = require(`./middleware/error-handler`);
const sendEmail = require("./controllers/sendEmail");

app.use(express.json());

app.get(`/`,(req, res)=>{
  res.send(`<h1>Email Project</h1><a href="/send">send email</a>`);
})

app.get(`/send`, sendEmail);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    app.listen(port, console.log(`server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
}

start();