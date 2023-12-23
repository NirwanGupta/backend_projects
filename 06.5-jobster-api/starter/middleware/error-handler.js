const { StatusCodes } = require(`http-status-codes`);

const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    //  set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || `Something went Wrong try again later`,
  }

  //  when the user doesnot give all the info at the time of register or login
  if(err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(`,`);
    customError.statusCode = 400;
  }

  //  when the params in case of getJob, update and delete doesnot match any of the existing jobs, error 404 not found
  if(err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }

  if(err.code && err.code == 11000) { //  the mongoose error for duplicate email has a property named code that is set to 11000
    customError.msg - `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`; //  the keyValue property has the field that has duplicate value, here email
    // err.keyValue was found to be Object.object on the postman, using a bit javascript use ${Object.keys()}
    customError.statusCode = 400;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
  return res.status(customError.statusCode).json({msg: customError.msg});

}

module.exports = errorHandlerMiddleware;