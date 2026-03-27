const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    connectCode:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        trim:true,
        minLength:2,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        minLength:6,
        required:true
    }
},{timestamps:true})


module.exports = mongoose.model('User', userSchema)