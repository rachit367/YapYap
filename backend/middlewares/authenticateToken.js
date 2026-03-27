const jwt=require('jsonwebtoken')

async function authenticateToken(req,res,next) {
    const token=req.cookies.token
    if(!token){
      return res.status(401).json({
      success: false,
      message: "No token"
    });
    }
    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.username = decoded.username
    req.email=decoded.email
    req.connectCode=decoded.connectCode
    req.user_id=decoded.user_id
    next();
  } catch (err) {
    return res.status(401).json({ success:false,message: "Invalid token" });
  }
}

module.exports={authenticateToken}