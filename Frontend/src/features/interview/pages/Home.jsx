import React from 'react'
import {useState, useRef} from 'react';
import '../pages/home.scss'
import {useInterview} from '../hooks/useInterview.js'
import { useNavigate } from 'react-router';

const Home = () => {
    const {loading, generateReport, reports} = useInterview()
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const resumeInputRef = useRef()
    const navigate = useNavigate();

    const handleGenerateReport = async()=>{
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({jobDescription, selfDescription, resumeFile})
        navigate(`/interview/${data._id}`)
    }

    const handleOpenReport = (reportId) => {
        navigate(`/interview/${reportId}`)
    }

if(loading){
    return (
        <main className='loading-screen'>
            <h1>Loading your interview plan..</h1>
        </main>
    )
}
  return (
    <>
      <main className='home'>
             <div className="left">
              <textarea onChange={(e)=>{setJobDescription(e.target.value)}} name="jobDescription" id="jobDescription" placeholder='Enter job description'></textarea>
             </div>
             <div className="right">
              <div className="input-group">
                  <label htmlFor='resume'>Upload Resume</label>
                  <input ref={resumeInputRef} type='file' name='resume' id='resume' accept='.pdf' />

              </div>
              <div className="input-group">
                  <label htmlFor='selfDescription'>Self Description</label>
                  <textarea onChange={(e)=>{setSelfDescription(e.target.value)}} name='selfDescription' id='selfDescription' placeholder='Describe yourseft'></textarea>
              </div>
              <button onClick={handleGenerateReport} className='generate-btn'>Generate Interview Report</button>
             </div>
      </main>

      <section className='report-history'>
        <div className='history-header'>
          <h2>Previous Reports</h2>
          <p>Click any card to view the full interview report.</p>
        </div>
        <div className='report-grid'>
          {reports?.length ? reports.map((item) => (
            <button key={item._id} type='button' className='report-card' onClick={() => handleOpenReport(item._id)}>
              <div className='report-card-top'>
                <h3>{item.title || 'Interview Report'}</h3>
                <span className='report-score'>{item.matchScore ?? '--'}%</span>
              </div>
              <div className='report-card-meta'>
                <span>{new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>{item.jobDescription ? 'Job details available' : 'No job details'}</span>
              </div>
            </button>
          )) : (
            <div className='empty-history'>No previous reports found yet.</div>
          )}
        </div>
      </section>
    </>
  )
}

export default Home