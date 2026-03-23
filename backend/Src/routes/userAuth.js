const express = require('express');
const authRouter = express.Router();
const {register, login, logout,adminRegister,getProfile,emailVerify,resetEmail,deleteProfile,setupFirstAdmin} = require('../controllers/userAuthent');
const userMiddleware = require("../middleware/userMiddlewere")
const adminMiddlewere = require("../middleware/adminMiddlewere");
const User = require('../models/user');



// Register
authRouter.post('/register',register);
// login
authRouter.post('/login',login);
// logout
authRouter.post('/logout',userMiddleware,logout);
// First Admin Initialization (Only works once)
authRouter.post('/admin/init', setupFirstAdmin);
//Admin register (Requires existing admin to create another admin)
authRouter.post('/admin/register',adminMiddlewere,adminRegister);
// GetProfile
authRouter.get('/getProfile',userMiddleware,getProfile);
// email-verify
authRouter.post('/emailVerify',emailVerify);
// reset-password
authRouter.post('/resetEmail',resetEmail);
// forget-password
// authRouter.post('/forgetEmail',forgetEmail);
// Delet-Profile

authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);

authRouter.get('/check', userMiddleware,(req,res)=>{
    const reply = {
        firstName: req.result.firstName,
        emailId: req.result.emailId,
        _id: req.result._id
    }

    res.status(200).json({
       User:reply,
       message: "Valid User"
    })
})


module.exports = authRouter;