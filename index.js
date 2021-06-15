
const express = require('express')
const app = express()
const cors = require('cors')
const PORT  = process.env.PORT || 3000
const cookieParser = require('cookie-parser')
// const methodOverride = require('method-override')
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const authRoutes = require('./routes/authRoutes')
app.use(authRoutes)

app.listen(PORT,()=>{
    console.log('listening to port 3000')
})