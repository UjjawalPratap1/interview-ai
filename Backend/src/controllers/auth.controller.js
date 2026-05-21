const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model.js');
const tokenBlacklistModel = require('../models/blacklist.model.js');

/**
 * @name registerUserController
 * @description register a new user expects username, password, and email
 */
async function registerUsercontroller(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username }, { email }]
        })
        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username,
            email,
            password: hash
        })

        const token = jwt.sign(
            {
            id: user._id,username: user.username},
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )
        // add token to cookie
        res.cookie("token", token);

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            
        })  

    } catch (error) {
     res.status(500).json({
        message: "Something went wrong",
        error: error.message
     }) 
    }
};


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res){
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message: "all fields required"
            })
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        // decrypt password code
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        const token = jwt.sign(
            {
            id: user._id,username: user.username},
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )
        // add token to cookie
        res.cookie("token", token);

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })  
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        }) 
    }
}

/**
 * @name logoutUserController
 * @description user logout and also add token in the blacklist
 * @access Public
 */
async function logoutUserController(req, res){
    // Debug logs to help diagnose missing token
    console.log('Logout request cookies:', req.cookies);
    console.log('Logout request headers:', req.headers);
    console.log('Logout request query:', req.query);

    let token = req.cookies?.token;
    if (!token && req.headers?.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }
    if (!token && req.query?.token) {
        token = req.query.token;
    }

    if(!token){
        return res.status(401).json({
            message: "Unauthorized user"
        })
    }
    await tokenBlacklistModel.create({ token });
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    })
}


module.exports = {
    registerUsercontroller,
    loginUserController,
    logoutUserController
}
