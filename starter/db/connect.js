const mongoose = require(`mongoose`);

//  if i directly upload the file on gitHub, then anyone can access my connectionString, so in order to avoid this, I have to create a .env file
//  Package name = "dotenv"
//  create a .env file that has the connectionString as a global variable, import it in the app.js using required methods of dotenv, and pass it as an argument ton the connectDB
//  add this to he gitIgnore file like ".env"
//  now we can access these secrets of ours

const password = "pV8DomUxmOc8iyMy";
const encodedPassword = encodeURIComponent(password);
const userName = "guptanirwan";
const dataBaseName = "03-TASK-MANAGER";

// const connectionstring = `mongodb+srv://${userName}:${encodedPassword}@nodeexpressprojects.ehksps5.mongodb.net/${dataBaseName}?retryWrites=true&w=majority`;


mongoose.set(`strictQuery`, true);


//  using this, first our server is established and then we are connected to the dataBase, if we couldn't connect to the dataBase , then what is  the meaning of the server?

// mongoose
//     .connect(connectionstring, {
//         useNewUrlParser: true,
//         // useCreateIndex: true,
//         // useFindAndModify: false,
//         useUnifiedTopology: true,
//     })
// .then(()=>console.log(`CONNECTION ESTABLISHED...`))
// .catch((err)=>console.log(err));



//  So we want to connect to the dataBase and if the connection was established, then only we want to establish the server...
//  Now we invol=ke this connectDB in our app.js...

const connectDB = (URL) => {
    //  this returns a promise
    return mongoose.connect(URL, {     //  if you arent using .env then pass connectionString else pass url
                useNewUrlParser: true,
                // useCreateIndex: true,        // these two are not required in the mongoose version ^6.12.3
                // useFindAndModify: false,
                useUnifiedTopology: true,
            })
}

module.exports = connectDB;