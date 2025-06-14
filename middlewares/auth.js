const jwt = require("jsonwebtoken")

exports.auth=(req,res,next)=>{
    const {authorization} =req.headers;

    if(!authorization){
        return res.status(401).json({
            status:"fail",
            message:"You are not logged in"
        })
    }

    try{
        let decode = jwt.verify(authorization,process.env.SECRET);
        req.id=decode.id;
        req.role=decode.role;
        next();
    }catch(err){
        console.log(err)
        return res.status(401).json({
            status:"fail",
            message:"You are not authenticated"
        })
    }
    
}

exports.restrictTo= (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.role)){
            res.status(401).json({
                status:"fail",
                message:"You do not have permission."
            })
        }else{
            next();
        }
    }
}