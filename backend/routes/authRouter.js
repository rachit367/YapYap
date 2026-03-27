const express=require('express')
const router=express.Router()
const {authenticateToken}=require('./../middlewares/authenticateToken')
const {
    register,
    login,
    getUserProfile,
    logout,
    searchUsers
}=require('./../controllers/authController')

router.post('/register',register)
router.post('/login',login)
router.get('/me',authenticateToken,getUserProfile)
router.post('/logout',authenticateToken,logout)
router.get('/users/search',authenticateToken,searchUsers)

module.exports=router