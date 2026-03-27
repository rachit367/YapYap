
async function errorHandling(err,req, res, next){
    const error=err.message || "Internal server error"
    const status=err.statusCode || 500
    res.status(status).json({
        success:false,
        message:error
    })
};

module.exports=errorHandling