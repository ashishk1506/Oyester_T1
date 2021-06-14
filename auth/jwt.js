const {sign, verify} = require('jsonwebtoken')

const createToken = (user) =>{
    const accessToken = sign({name : user.name, id: user.id},"secrte")

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
            req.user = validToken.name
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