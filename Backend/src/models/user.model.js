const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true, "username aready taken"],
        required:true
    },
    email:{
        type:String,
        unique:[true, "Account already exist with the email address"],
        required:true
    },
    passoword:{
        type:String,
        required:true
    }
})

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;