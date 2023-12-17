//  since aur mongodb atlas doesnot have a specific structure of the data that need to be stored, thus we need to create a structure of the data that is needed to be stored.

//  This is done using mongoose.Schema

const mongoose = require(`mongoose`);

//  only the properties that are defined in the Schema will be passed to the dataBase... rest all will be ignored...
//  This is without validation, however validation is necessary since without it we can send empty fields
/*
const TaskSchema = new mongoose.Schema({
    name:String,
    completed: Boolean,
});
*/

//  with validation
const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        required: [true, "must provide name"],
        trim: true,     //  to remove the whitespaces before and after the actual name
        // maxlength: 20
        maxlength: [20, "Name cannot be greater than 20"]
    },
    completed: {
        type: Boolean,
        default: false
    }
})

//  mongoose model provides an interface to the dataBase

module.exports = mongoose.model(`Task`, TaskSchema);