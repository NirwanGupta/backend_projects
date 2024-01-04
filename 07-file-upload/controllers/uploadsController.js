const Product = require(`../models/Product`);
const { StatusCodes } = require(`http-status-codes`);

const uploadProductImage = async(req, res) => {
    res.send("Upload Image");
};

module.exports = {
    uploadProductImage,
};