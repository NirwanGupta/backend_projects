const mongoose = require(`mongoose`);

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        requires: [true, `Please provide company name`],
        maxlength: 50,
    },
    position: {
        type: String,
        required: [true, `Pleaseprovide position`],
        maxlength: 100,
    },
    status: {
        type: String,
        enum: [`interview`, `declined`, `pending`],
        default: `pending`,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: `User`,    //  which model are we refrencing
        required: [true, `Please provide user`],
    },
},{timestamps: true});

module.exports = mongoose.model(`Job`, JobSchema);