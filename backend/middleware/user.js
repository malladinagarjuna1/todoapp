const jwt = require('jsonwebtoken');
const SECRET =  process.env.JWT_SECRET_KEY;
const authenticateJwt= (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split('')[1];
    jwt.verify(token, SECRET,(err, user)=>{
        if(err){
            return res.status(403).json({message: 'forbidden invalid token '});

        }
        req.userId = user.userId;
        next();
    
    });
    }else{
        res.status(401).json({message:'Unauthorized: No token provided'});

    }};

    module.exports={
        authenticateJwt, 
        SECRET,
    };
    