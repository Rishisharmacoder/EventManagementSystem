const mongoose = require('mongoose');
const {Schema}=  mongoose;

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        minLength:3,
        maxLength:20,
    },
    lastName:{
        type: String,
        minLength:3,
        maxLength:20,
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true,
    },
    age:{
        type: Number,
        min:6,
        max:80,
    },
    role:{
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
        eventsAttending: [
            {
                type: Schema.Types.ObjectId,
                ref: "event",
            },
        ],
    password:{
        type: String,
        required: true
    }
},{
    timestamps: true
});
// is Taraha se v delet hota hai ye last me chalega kau ki ye post operation hai

// Cleaned up leetcode submission code
const User = mongoose.model("user",userSchema, "event_users");

module.exports = User;

