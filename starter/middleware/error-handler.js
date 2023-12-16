const { CustomAPIerror } = require(`../errors/custom-errors`);

const errorHandlerMiddleware = (err, req, res, next) => {
    if(err instanceof CustomAPIerror) {
        return res.status(err.status).json({msg: err.message});
    }
    return res.status(500).json({msg: `Something went wrong, please try later`});
}

module.exports = errorHandlerMiddleware;