import axios from "axios";


const api = axios.create({
    baseURL: "https://interview-ai-application.onrender.com",
    withCredentials: true
})

export async function generateInterviewReport({ selfDescription, jobDescription, resumeFile}){
    try {
        const formData = new FormData();
        formData.append("selfDescription", selfDescription);
        formData.append("jobDescription", jobDescription);
        formData.append("resume", resumeFile);

        const response = await api.post("/api/interview/", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error generating interview report:", error);
        throw error;
    }
}

export async function getInterviewReportById(interviewId){
    try {
        const response = await api.get(`/api/interview/report/${interviewId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching interview report:", error);
        throw error;
    }
}

export async function getAllInterviewReports(){
    try {
        const response = await api.get("/api/interview/");
        return response.data;
    } catch (error) {
        console.error("Error fetching interview reports:", error);
        throw error;
    }
}