const redisClient = require('../config/redis');
const User = require('../models/user');
const validate = require('../utils/validator');
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const Registration = require('../models/registration');


const register = async (req,res)=>{

    try{
     // validate the data
       validate(req.body);
        
        const {firstName, emailId, password} = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user'
        
        const user = await User.create(req.body);
        const token = jwt.sign({_id:user._id ,emailId: emailId, role:'user'},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id
        }

        res.status(201).json({
            user:reply,
            message:"Signup Successfully"
        })
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


const login = async(req,res)=>{

    try{
       const {emailId, password} =req.body;

       if(!emailId)
          throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");
 
        const user = await User.findOne({emailId});
        if(!user)
            throw new Error("User Not Found");

        const match = bcrypt.compare(password, user.password)

        if(!match){
            throw new Error("Invalid Credentials");
        }

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id
        }

        const token = jwt.sign({_id:user._id ,emailId: emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000}); 
        res.status(201).json({
            user:reply,
            message:"Login Successfully"
        })
    } 
    catch(err){
        res.status(401).send("Error: "+err)
    }
}

const logout = async (req, res,next) => {
    try {

        const { token } = req.cookies;

        const payload = jwt.verify(token, process.env.JWT_KEY);

        await redisClient.set(`token:${token}`, "Blocked");
        await redisClient.expireAt(`token:${token}`, payload.exp);

        res.cookie("token", null, { expires: new Date(Date.now()) });

        res.send("Logged Out Successfully");

    } catch (err) {
        res.status(503).send("Error: " + err.message);
    }
}

const adminRegister = async (req,res)=>{
    try{
     // validate the data
       validate(req.body);
        
        const {firstName, emailId, password} = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        //  Role set: agar body mein role='admin' hai to admin, nahi to user
        req.body.role = req.body.role === 'admin' ? 'admin' : 'user';
        
        const user = await User.create(req.body);
        const token = jwt.sign({_id:user._id ,emailId: emailId, role:user.role}, process.env.JWT_KEY, {expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(201).send("User Registered Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const getProfile = async (req, res) => {

    try {
        const userId = req.result._id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile fetched",
            data: user
        });

    }
    catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};


const emailVerify = async (req, res) => {

    try {

        const { emailId } = req.body;

        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.isVerified = true;

        await user.save();

        res.status(200).json({
            message: "Email verified successfully"
        });

    }
    catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};


const resetEmail = async (req, res) => {

    try {

        const { emailId, newPassword, password } = req.body;
        const passToSet = newPassword || password;

        if (!emailId || !passToSet) {
             return res.status(400).json({ message: "EmailId and Password are required" });
        }

        const user = await User.findOne({ emailId });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const hashPassword = await bcrypt.hash(passToSet, 10);

        user.password = hashPassword;

        await user.save();

        res.status(200).json({
            message: "Password reset successful"
        });

    }
    catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};

// const forgetEmail = async (req, res) => {

//     try {

//         const { emailId } = req.body;

//         const user = await User.findOne({ emailId });

//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found"
//             });
//         }

//         const token = jwt.sign(
//             { id: user._id },
//             "SECRETKEY",
//             { expiresIn: "10m" }
//         );

//         res.status(200).json({
//             message: "Reset token generated",
//             token: token
//         });

//     }
//     catch (err) {

//         res.status(500).json({
//             message: err.message
//         });

//     }
// };

const deleteProfile = async(req,res)=>{
    try{
         const userId = req.result._id;
         
         const Event = require("../models/event");

         if (req.result.role === 'admin') {
             const events = await Event.find({ createdBy: userId });
             const eventIds = events.map(e => e._id);
             await Registration.deleteMany({ eventId: { $in: eventIds } });
             // Remove events from other users' eventsAttending list
             const UserModel = require("../models/user");
             await UserModel.updateMany(
                 { eventsAttending: { $in: eventIds } },
                 { $pull: { eventsAttending: { $in: eventIds } } }
             );
             await Event.deleteMany({ createdBy: userId });
         }

         // userSchema se delet
         const UserModelForDelete = require("../models/user");
         await UserModelForDelete.findByIdAndDelete(userId);

         // Registration se bhi delet
         await Registration.deleteMany({userId});

         res.status(200).send("Deleted Successfully");
    }
    catch(err){
        res.status(500).send("Internal Server Error");
    }
}

const setupFirstAdmin = async (req,res)=>{
    try{
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount > 0) {
            return res.status(403).json({ message: "An Admin already exists. You must login as an admin and use /admin/register to create more." });
        }
        
        validate(req.body);
        
        const {firstName, emailId, password} = req.body;
        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'admin'; 
        
        const user = await User.create(req.body);
        res.status(201).json({ message: "First Admin Registered Successfully!" });
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

module.exports = {register, login, logout,adminRegister,getProfile,emailVerify,resetEmail,deleteProfile,setupFirstAdmin};