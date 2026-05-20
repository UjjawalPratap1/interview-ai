const userModel = require('../models/user.model.js')

/**
 * @name registerUserController
 * @description register a new user expects username, password, and email
 */
async function registerUsercontroller(req, res){
    try {
        const {username, email, passowrd} = req.body;
        if(!username || !email || !password){
            return res.status(401).json({
                message:"All fields are required"
            })
        }
        
    } catch (error) {
        
    }
};



module.exports = {
    registerUsercontroller
}
