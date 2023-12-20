const mongoose = require('mongoose')

mongoose.set(`strictQuery`, true);

const connectDB = (URL) => {
  return mongoose.connect(URL, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
}

module.exports = connectDB
