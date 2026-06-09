const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes.js')
const cors = require('cors');
const app = express();
const interviewRouter = require('./routes/interview.routes.js')

app.use(cors({
    origin:
    "https://interview-ai-application.onrender.com",
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;