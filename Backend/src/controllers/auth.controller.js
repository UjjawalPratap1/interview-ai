const userModel = require('../models/user.model.js')

/**
 * @name registerUserController
 * @description register a new user expects username, password, and email
 */
async function registerUsercontroller(req, res) {
    try {
        const { username, email, passowrd } = req.body;
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



module.exports = {
    registerUsercontroller
}
