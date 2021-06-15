const {sign, verify} = require('jsonwebtoken')

const createToken = (user) =>{
    const accessToken = sign({username : user.username, id: user.id},"secrte")
    console.log(user)
    return accessToken
}

const validateToken = (req,res,next) =>{
    const accessToken = req.cookies["oyester"]
    if(!accessToken)
     return res.status(400).send({error:"User not authenticated"})

    try{
        const validToken = verify(accessToken,"secrte")
        if(validToken){
            req.authenticated = true
            req.username = validToken.username
            req.id = validToken.id
            return next()
        }
        else{
            return res.status(400).json({error: "invalid token"})
        }
    }catch(err){
        return res.status(400).send({error:err})
    }
}

module.exports = {createToken, validateToken}