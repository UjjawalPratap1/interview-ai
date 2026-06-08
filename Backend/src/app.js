const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes.js')
const cors = require('cors');
const app = express();
const interviewRouter = require('./routes/interview.routes.js')

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173",
    "https://interview-ai-2-kefk.onrender.com"
    ],credentials: true
}))
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;