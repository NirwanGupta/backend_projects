const mongoose = require(`mongoose`);
const validator = require(`validator`); //  if we use this package we donot need match to validate the email

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `Please enter name`],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, `Please povide email`],
        // match: [
        //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        //     'Please provide a valid email',
        // ],

        //  either use match or use validate directly from the package to validate the email
        validate: {
            validator: validator.isEmail,
            message: `Please provide valid email`,
        },
        // unique: true,
    },
    password: {
        type: String,
        required: [true, `Please provide password`],
        minlength: 6,
    },
    role: {
        type: String,
        emum: ['admin','user'],
        default: 'user',
    },
});

module.exports = mongoose.model(`User`, userSchema);