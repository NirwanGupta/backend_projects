const { StatusCodes } = require(`http-status-codes`);
const path = require(`path`);

const CustomError = require(`../errors`);
const cloudinary = require(`cloudinary`).v2;
const fs = require(`fs`);

const uploadProductImageLocal = async(req, res) => {
    //  if file exisis
    //  check format
    //  check size

    if(!req.files) {
        throw new CustomError.BadRequestError(`No File Uploaded`);
    }
    let productImage = req.files.image;

    //  format -> there is a property in the productImage called minetype, if this minetype doesnot starts with 'image' then this means that the user chose a file that is not an image
    if(!productImage.mimetype.startsWith(`image`)) {
        throw new CustomError.BadRequestError(`Please upload Image`);
    }

    //  there is a prperty named size in the productImage that stores the size of the selected image in bytes
    const maxSize = 1024*1024;
    if(productImage.size > maxSize) {
        throw new CustomError.BadRequestError(`Please upload Image smaller than 1KB`);
    }

    const imagePath = path.join(__dirname, `../public/uploads/`+`${productImage.name}`);
    await productImage.mv(imagePath);

    return res.status(StatusCodes.OK).json({image: {src: `/uploads/${productImage.name}`}})
};

const uploadProductImage = async(req, res) => {
    // console.log(req.files.image); -> now this has tempFilePath where the image is stored
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        use_filename: true,
        folder: 'file-upload'
    });
    
    console.log(result);
    fs.unlinkSync(req.files.image.tempFilePath);
    // console.log(result); //  ->throgh this we know that using cloudinary our image is located at the link result.secure_url
    return res.status(StatusCodes.OK).json({image: {src: result.secure_url}});
}

module.exports = {
    uploadProductImage,
};