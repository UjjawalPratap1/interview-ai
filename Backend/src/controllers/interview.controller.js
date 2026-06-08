const generateInterviewReport = require('../services/ai.service.js');
const { PDFParse } = require('pdf-parse');
const interviewReportModel = require('../models/interviewReport.model.js');


/**
 * @route POST /api/interview/
 * @description Generate an interview report based on the candidate's resume, self-description, and job description.
 * @access Private
 */
async function generateInterviewReportController(req, res){
    if (!req.file || !req.file.buffer) {
        return res.status(400).json({ message: 'Resume file is required' });
    }

    const buffer = req.file.buffer;
    const resumeFileData = Buffer.isBuffer(buffer)
        ? new Uint8Array(buffer)
        : buffer instanceof Uint8Array
            ? buffer
            : new Uint8Array(buffer);

    const resumeContent = await new PDFParse({ data: resumeFileData }).getText();
    const { selfDescription, jobDescription } = req.body;
    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })
const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi
})

res.status(201).json({
    message: "Interview report generated successfully",
    interviewReport
})


}

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get a specific interview report by its ID.
 * @access Private
 */
async function getInterviewReportByIdController(req, res){
    const {interviewId} = req.params;
    const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user.id});

    if(!interviewReport){
        return res.status(404).json({message: "Interview report not found"});
    }
    res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport
    });
}


/**
 * @route GET /api/interview/
 * @description Get all interview reports of logged in user.
 * @access Private
 */
async function getAllInterviewReportsController(req, res){
    const interviewReports = await interviewReportModel.find({user: req.user.id})
    .sort({createdAt: -1})
    .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
    res.status(200).json({
        message: "Interview reports fetched successfully",
        interviewReports
    });

}


module.exports = { generateInterviewReportController 
    , getInterviewReportByIdController,
    getAllInterviewReportsController
};

