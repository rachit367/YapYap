const jwt=require('jsonwebtoken')

async function generateToken(username,connectCode,email,_id) {
    try{
        const token=jwt.sign({
        username,
        connectCode,
        email,
        user_id:_id
        },process.env.JWT_SECRET,
        {expiresIn:'7d'}
    )
        return token
    }catch(err){
        throw err
    }
}

module.exports={generateToken}