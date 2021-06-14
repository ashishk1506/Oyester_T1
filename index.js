
const express = require('express')
const app = express()
const PORT  = process.env.PORT || 3000
const cookieParser = require('cookie-parser')
// const methodOverride = require('method-override')
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

// app.use(methodOverride('_method'))
const {createToken, validateToken} = require('./auth/jwt')
const { admin_table : admin} = require('./db/admin')
const { posts} = require('./db/posts')



app.get('/',validateToken,(req,res)=>{
    res.send({
        m:"hi",
        username : req.user,
        id : req.id
    })
})
app.post('/registration',async (req,res)=>{
    const { username , password} = req.body
    //check if username already exist
    const reg_user = admin.find((data)=>{
        return data.name == username
    })
    if(reg_user)
     return res.status(409).json({message:"username alreay exist"})
    const id_counter = admin.length+1
    await admin.push({id:id_counter, name: username, password: password})
    res.json({
        message:"User added succesfully"
    })
    console.log(admin)
})
app.get('/login',async (req,res)=>{
    res.clearCookie("oyester")
    const {login_username, login_password} = req.query
    //check if user exist
    const user = await admin.find((data)=>{
       return data.name == login_username
    })
    if(!user)
     return res.status(400).json({error:"user does not exist"})
    //check if password matches
    if(login_password != user.password)
     return res.status(400).json({error:"Wrong username or password"})

     const accessToken = createToken(user)
     //saving the token in admin.js
     user.token = accessToken
     console.log(user)
     res.cookie("oyester", accessToken, {
         maxAge : 60*60*24*30*1000,
         httpOnly: true
     })
    res.json("LOG IN SUCCESS")
})

//get all posts for an admin 
app.get('/posts',validateToken,(req,res)=>{
    const admin_id  = req.id
    const admin_post = posts.filter((data) =>{
        return admin_id == data.userId
    })
    if(!admin_post)
    return res.status(404).json({message:"No post for admin"})
    res.json(admin_post)
})

//get posts by id for admin
app.get('/posts/:id',validateToken,async (req,res)=>{
    const { id } = req.params
    const admin_id = req.id
    const admin_post = posts.filter((data) =>{
        return admin_id == data.userId
    })
    if(!admin_post)
    return res.status(404).json({message:"No post for admin"})
    //filtering post
    const post_byid = admin_post.find((data)=>{
        return id == data.id
    })
    if(!post_byid)
    return res.status(404).json({message:"No post found with given id for current admin"})
    return res.json(post_byid)
})

//create a new post
app.post('/posts',validateToken, async (req,res)=>{
   const {title, body} = req.body
   const admin_id = req.id
   //retriving the last post id
   const admin_post = posts.filter((data) =>{
    return admin_id == data.userId
   })
   const last_postid = admin_post.length*admin_id +1
   let new_post = {
    "userId":admin_id,
     "id": last_postid,
     "title": title,
     "body":body
        }
   await posts.push(new_post)
   return res.json(new_post)
})

//delete post
app.delete('/posts/:id',validateToken, async (req,res)=>{
    const { id } = req.params
    const admin_id = req.id
    post_index = posts.findIndex((data) =>{
      if(data.userId == admin_id){
          if(data.id == id)
          return data
      }
    })
    if(post_index == -1)
    return res.status(400).json({
        message:"post does not exist"
    })
    //delete
    const result = await posts.splice(post_index,1)
    return res.json({
        message : "post deleted",
        data : result
    })
 })

 //update by id
 app.put('/posts/:id',validateToken,async (req,res)=>{
    const { id } = req.params
    const admin_id = req.id
    const {title,body} = req.body
    const admin_post = posts.filter((data) =>{
        return admin_id == data.userId
    })
    if(!admin_post)
    return res.status(404).json({message:"No post for admin"})
    //filtering post
    const post_byid = admin_post.find((data)=>{
        return id == data.id
    })
    if(!post_byid)
    return res.status(404).json({message:"No post found with given id for current admin"})
    
    //update
    post_byid.title = title
    post_byid.body = body
    return res.json({
        message : "post updates",
        post : post_byid
    })
})

//logout
app.get('/logout',validateToken,async (req,res)=>{
    try{
      res.clearCookie("oyester")
      await req.user.save()
      res.redirect('/login')
    }catch(err){
        return res.status(500).json({error: err})
    }
})

app.listen(PORT,()=>{
    console.log('listening to port 3000')
})