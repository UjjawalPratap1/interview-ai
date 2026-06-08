const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model.js");


 async function authUser(req, res, next) {
    try {
        console.log("cookies", req.cookies);
        console.log("Headers", req.headers.cookie);
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isTokenBlacklisted) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized",
            error: error.message
        })
    }
}

module.exports = {authUser};