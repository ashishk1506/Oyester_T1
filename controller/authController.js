const bcrypt = require('bcryptjs')
const { createToken} = require('../auth/jwt')
const dbConn = require('../db/dbConfig')

module.exports.home = (req,res) =>{
    res.send({
        m:"hi",
        username : req.username,
        id : req.id
    })
}

module.exports.login = async (req,res) =>{

    const {login_username, login_password} = req.query
    //check if user exist
    try{
        dbConn.query('SELECT * FROM users WHERE username = ?',login_username,(err,result)=>{
            if(err)
              return res.status(400).send({err})
            if(result.length == 0){
               return  res.status(400).send({
                    message :"Username does not exist"
                })
            }
            else{
                let passwordIsValid = bcrypt.compareSync(login_password, result[0]['password'])
                if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })

                   const accessToken = createToken(result[0])
                //    user.token = accessToken
                   res.cookie("oyester", accessToken, {
                       maxAge : 60*60*24*30*1000,
                       httpOnly: true
                   })
                  return res.json("LOG IN SUCCESS")
            }
        })
    }catch(e){
        console.log(e)
    }
}

module.exports.registration = async (req,res) =>{
    password = bcrypt.hashSync(req.body['password'], 10)
    // Checking presence of all fields
    if (req.body['username'] && req.body['password']) {
        
        //Checking if same email exists  
        try{
            dbConn.query('SELECT * FROM users WHERE username = ?',req.body['username'],(err,result)=>{
                if(err)
                  return res.status(400).send(err)
                if(result.length != 0){
                    return res.status(400).json({ message: "username already exists!" })
                } else {
                    try{
                         dbConn.query('INSERT INTO users (username,password) VALUES (?,?)',
                            [req.body.username,password],(err,res1)=>{
                            if(err)
                             return  res.status(400).send(err)
                            return res.json({ message: "User added successfully!", user_id: res1 })
                        })
                    }catch(e)
                     {
                        console.log(e)
                     }
                }
                })
        }catch(e){
            console.log(e)
          }  
        }
    }


module.exports.get_posts = (req,res) =>{
    const user_id  = req.id
    try{
        dbConn.query('SELECT * FROM posts WHERE user_id = ?',req.id,(err,result)=>{
            if(err)
            return res.status(400).send(err)
            if(result.length == 0 ){
                return res.status(400).send({message :"No post found"})
            }
            return res.json(result)
        })
    }catch(e){
        console.log(e)
    }
}
module.exports.get_post_byid = (req,res) =>{
    const { id } = req.params
    const user_id  = req.id
    try{
        dbConn.query('SELECT * FROM posts WHERE user_id = ? AND id = ?',[user_id,id],(err,result)=>{
            if(err)
            return res.status(400).send(err)
            if(result.length == 0 ){
                return res.status(400).send({message :"No post found"})
            }
            return res.json(result[0])
        })
    }catch(e){
        console.log(e)
    }
}

module.exports.update_post_byid = (req,res) =>{
    const { id } = req.params
    const user_id = req.id
    const {post} = req.body
    try{
        dbConn.query('SELECT * FROM posts WHERE user_id = ? AND id = ?',[user_id,id],(err,result)=>{
            if(err)
            return res.status(400).send(err)
            if(result.length == 0 ){
                return res.status(400).send({message :"No post found"})
            }
            dbConn.query('UPDATE posts SET post = ? WHERE id = ? AND user_id = ?',[post,id,user_id],(err,res1)=>{
                if(err)
                return res.status(400).send(err) 
                return res.json({
                    message:"post updated",
                    id : id,
                    user_id : user_id,
                    new_post : post
                })
            })
        })
    }catch(e){
        console.log(e)
    }
}

module.exports.create_post = async (req,res) =>{
    const {post} = req.body
    const user_id = req.id
    //retriving the last post id
    try{
        dbConn.query('INSERT INTO posts (user_id,post) VALUES (?,?)',[user_id,post],(err,result)=>{
            if(err)
            return res.status(400).send(err)
            return res.json({
                message : "new post added",
                user_id : user_id,
                post : post
            })
        })
    }catch(e){
        console.log(e)
    }
}

module.exports.delete_post_byid = async (req,res) =>{
    const { id } = req.params
    const user_id = req.id
    try{
        dbConn.query('SELECT * FROM posts WHERE user_id = ? AND id = ?',[user_id,id],(err,result)=>{
            if(err)
            return res.status(400).send(err)
            if(result.length == 0)
            return res.status(400).send({ message : "post to be deleted does not exist"})
            dbConn.query('DELETE FROM posts WHERE user_id = ? AND id = ?',[user_id,id],(err,result)=>{
                if(err)
                return res.status(400).send(err)
                return res.json({
                    message : "post deleted",
                    post_id : id
                })
            })
        })
    }catch(e){
        console.log(e)
    }
}

module.exports.logout = async (req,res)=>{
        try{
          res.cookie("oyester",'',{maxAge:1})
          return res.send({message : "logout success"})
        }catch(err){
            return res.status(500).json({error: err})
        }
}