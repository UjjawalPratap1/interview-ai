const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller.js')

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 * 
 */
authRouter.post("/register", authController.registerUsercontroller);

/**
 * @route Post /api/auth/login
 * @description login user with Register email and password
 * @access Public
 */
authRouter.post("/login", authController.loginUserController);

/**
 * @route Get /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
authRouter.get("/logout", authController.logoutUserController);


module.exports = authRouter;