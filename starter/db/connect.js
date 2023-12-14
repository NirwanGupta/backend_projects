const mongoose = require(`mongoose`);

const password = "pV8DomUxmOc8iyMy";
const encodedPassword = encodeURIComponent(password);
const userName = "guptanirwan";
const dataBaseName = "03-TASK-MANAGER";
const connectionstring = `mongodb+srv://${userName}:${encodedPassword}@nodeexpressprojects.ehksps5.mongodb.net/${dataBaseName}?retryWrites=true&w=majority`;

mongoose.set(`strictQuery`, true);

mongoose
    .connect(connectionstring, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(()=>console.log(`CONNECTION ESTABLISHED...`))
    .catch((err)=>console.log(err));