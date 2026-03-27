const dotenv=require('dotenv')
const express=require('express')
const cors=require('cors')
const path=require('path')
const cookieParser=require('cookie-parser')
const app=express()

const {connectDB}=require('./config/db')
const errorHandling=require('./middlewares/errorHandling')

const authRouter=require('./routes/authRouter')
const conversationRouter=require('./routes/conversationRouter')
const messageRouter=require('./routes/messageRouter')

dotenv.config({path:path.join(__dirname,'.env')})
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_URI,
    credentials:true
}))
connectDB()

app.use('/api/auth',authRouter)
app.use('/api/conversations',conversationRouter)
app.use('/api/messages',messageRouter)

app.use(errorHandling)
module.exports={app}