const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware.js');
const interviewRouter = express.Router();
const interviewController = require('../controllers/interview.controller.js');
const upload = require('../middlewares/file.middleware.js');

/**
 * @route POST /api/interview/
 * @description Generate an interview report based on the candidate's resume, self-description, and job description.
 * @access Private
 */
interviewRouter.post('/',authMiddleware.authUser,upload.single('resume'),interviewController.generateInterviewReportController);


/**
 * @route GET /api/interview/report/:interviewId
 * @description Get a specific interview report by its ID.
 * @access Private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);

/**
 * @route GET /api/interview/
 * @description Get all interview reports of logged in user.
 * @access Private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController);

module.exports = interviewRouter;