import React, { useState, useEffect } from 'react'
import './interview.scss'
import { useNavigate, useParams } from 'react-router'
import { useInterview } from '../hooks/useInterview.js'

const sections = [
  'Technical Questions',
  'Behavioral Questions',
  'Road Map'
]

const Interview = () => {
  const [activeSection, setActiveSection] = useState('Technical Questions')
  const [activeQuestion, setActiveQuestion] = useState(0)
  const {interviewId} = useParams();
  const { report, getReportById, loading } = useInterview();

  const technicalQuestions = report?.technicalQuestions || []
  const behavioralQuestions = report?.behavioralQuestions || []
  const skillGaps = report?.skillGaps || []
  const planSteps = report?.preparationPlan || []
  const matchScore = report?.matchScore ?? null
  const reportTitle = report?.title || 'Interview Report'
  const hasReport = Boolean(report)

  useEffect(()=>{
    if(interviewId){
       getReportById(interviewId)
    }
  },[interviewId])

  const renderEmptyState = () => (
    <div className='empty-state'>
      <p>No interview report is loaded yet.</p>
      <p>Generate a report from the Home page or select one from your history.</p>
    </div>
  )

  const content = () => {
    if (!hasReport) {
      return renderEmptyState()
    }

    if (activeSection === 'Behavioral Questions') {
      return (
        <div className='question-list'>
          {behavioralQuestions.length ? behavioralQuestions.map((item, index) => (
            <article key={index} className={`question-card ${activeQuestion === index ? 'open' : ''}`}>
              <button className='question-title' type='button' onClick={() => setActiveQuestion(index)}>
                <span className='question-badge'>Q{index + 1}</span>
                <span>{item.question}</span>
                <span className='expand-icon'>{activeQuestion === index ? '-' : '+'}</span>
              </button>
              {activeQuestion === index && (
                <div className='question-body'>
                  <div className='note-block intention'>
                    <span>INTENTION</span>
                    <p>{item.intention}</p>
                  </div>
                  <div className='note-block answer'>
                    <span>MODEL ANSWER</span>
                    <p>{item.answer}</p>
                  </div>
                </div>
              )}
            </article>
          )) : <p className='empty-text'>No behavioral questions were generated.</p>}
        </div>
      )
    }

    if (activeSection === 'Road Map') {
      return (
        <div className='question-list'>
          {planSteps.length ? planSteps.map((step, index) => (
            <article key={index} className='question-card open'>
              <div className='question-title' type='button'>
                <span className='question-badge'>{index + 1}</span>
                <span>{step.day || step.title}</span>
              </div>
              <div className='question-body'>
                <div className='note-block intention'>
                  <span>FOCUS</span>
                  <p>{step.focus}</p>
                </div>
                <div className='note-block answer'>
                  <span>TASK</span>
                  <p>{step.tasks}</p>
                </div>
              </div>
            </article>
          )) : <p className='empty-text'>No roadmap steps were generated.</p>}
        </div>
      )
    }

    return (
      <div className='question-list'>
        {technicalQuestions.length ? technicalQuestions.map((item, index) => (
          <article key={index} className={`question-card ${activeQuestion === index ? 'open' : ''}`}>
            <button className='question-title' type='button' onClick={() => setActiveQuestion(index)}>
              <span className='question-badge'>Q{index + 1}</span>
              <span>{item.question}</span>
              <span className='expand-icon'>{activeQuestion === index ? '-' : '+'}</span>
            </button>
            {activeQuestion === index && (
              <div className='question-body'>
                <div className='note-block intention'>
                  <span>INTENTION</span>
                  <p>{item.intention}</p>
                </div>
                <div className='note-block answer'>
                  <span>MODEL ANSWER</span>
                  <p>{item.answer}</p>
                </div>
              </div>
            )}
          </article>
        )) : <p className='empty-text'>No technical questions were generated.</p>}
      </div>
    )
  }

  const sectionCounts = {
    'Technical Questions': `${technicalQuestions.length} QUESTIONS`,
    'Behavioral Questions': `${behavioralQuestions.length} QUESTIONS`,
    'Road Map': `${planSteps.length} DAYS`
  }

  return (
    <main className='interview-page'>
      <aside className='interview-sidebar'>
        <div className='sidebar-title'>SECTIONS</div>
        {sections.map((section) => (
          <button
            key={section}
            className={`sidebar-button ${activeSection === section ? 'active' : ''}`}
            type='button'
            onClick={() => {
              setActiveSection(section)
              setActiveQuestion(0)
            }}
          >
            {section}
          </button>
        ))}
      </aside>

      <section className='interview-content'>
        <div className='interview-header'>
          <div>
            <h1>{activeSection}</h1>
            <p className='subtitle'>{sectionCounts[activeSection]}</p>
          </div>
        </div>

        {content()}
      </section>

      <aside className='interview-summary'>
        <div className='match-card'>
          <div className='match-header'>
            <h3>MATCH SCORE</h3>
          </div>
          <div className='match-circle'>
            <span>{matchScore !== null ? `${matchScore}%` : '--'}</span>
          </div>
          <p className='match-text'>
            {matchScore !== null ? 'Strong match for this role' : 'Generate or load a report to view match score.'}
          </p>
        </div>

        <div className='gaps-card'>
          <h3>SKILL GAPS</h3>
          <div className='gap-list'>
            {skillGaps.length ? skillGaps.map((gap, index) => {
              const severity = gap.severity || 'Low'
              const name = gap.skill || gap.name || 'Unnamed gap'
              return (
                <div key={index} className={`gap-pill gap-pill-${severity.toLowerCase()}`}>
                  <span>{name}</span>
                  <span className='gap-severity'>{severity}</span>
                </div>
              )
            }) : <p className='empty-text'>No skill gaps were generated.</p>}
          </div>
        </div>
      </aside>
    </main>
  )
}

export default Interview