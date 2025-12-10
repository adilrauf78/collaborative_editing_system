const jwt = require('jsonwebtoken');

module.exports = async(req, res, next) =>{
    try {
        //token
        const token  = req.headers['authorization'].split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) =>{
            if(err){
                return res.status(401).send({
                    success: false,
                    message: 'Un-Authorize User'
                });
            }
            else{
                req.user = { id: decode.id };
                next();
            }
        });
    } catch (error) {
       console.log(error);
       res.status(500).send({
        success: false,
        message: 'Error in auth Api',
       }) 
    }
}