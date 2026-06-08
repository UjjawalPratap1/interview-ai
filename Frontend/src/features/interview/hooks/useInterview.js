import {getAllInterviewReports ,generateInterviewReport, getInterviewReportById} from "../services/interview.api"
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context.jsx";
import { useParams } from "react-router";

export const useInterview = ()=>{
    const context = useContext(InterviewContext);
    const {interviewId} = useParams();
    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider");
    }
    const {loading, setLoading, report, setReport, reports, setReports} = context;

    const generateReport = async ({selfDescription, jobDescription, resumeFile})=>{
        setLoading(true);
        let response = null
        try {
            response = await generateInterviewReport({selfDescription, jobDescription, resumeFile});
            setReport(response.interviewReport);
        } catch (error) {
            console.error("Error generating interview report:", error?.response?.data || error.message || error);
            throw error;
        } finally {
            setLoading(false);
        }
        return response?.interviewReport ?? null
    }

const getReportById = async (interviewId)=>{
    setLoading(true);
    let response = null;
    try {
        response = await getInterviewReportById(interviewId);
        setReport(response.interviewReport);
    } catch (error) {
        console.error("Error fetching interview report:", error?.response?.data || error.message || error);
        throw error;
    } finally {
        setLoading(false);
    }
    return response?.interviewReport ?? null

}
   const getReports = async ()=>{
    setLoading(true);
    let response = null;
    try {
        response = await getAllInterviewReports();
        setReports(response.interviewReports);
    } catch (error) {   
        console.error("Error fetching interview reports:", error?.response?.data || error.message || error);
        throw error;
    } finally {
        setLoading(false);
    }
    return response?.interviewReports ?? []
}
 useEffect(()=>{
     if(interviewId){
        getReportById(interviewId)
     }else{
        getReports();
     }
   },[interviewId])
return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports
}
}

