import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, UploadCloud, Lightbulb, FileText, CheckCircle, Download } from 'lucide-react';
import ResultsDisplay from '../components/ResultsDisplay';
import './AnalysisPage.css';

const Stepper = ({ currentStep }) => {
    return (
        <aside className="stepper">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}><div className="step-number">1</div><div className="step-info"><span className="step-title">Upload Resume</span><span className="step-desc">Upload your resume file</span></div></div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}><div className="step-number">2</div><div className="step-info"><span className="step-title">Configure Analysis</span><span className="step-desc">Set your career level and job description</span></div></div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}><div className="step-number">3</div><div className="step-info"><span className="step-title">Analyze & Review</span><span className="step-desc">Get detailed feedback</span></div></div>
        </aside>
    );
};
const TipsSidebar = () => {
    return (
        <aside className="tips-sidebar">
            <div className="tips-card">
                <h3><Lightbulb size={20} /> Tips for Better Results</h3>
                <ul>
                    <li>Use a text-based PDF for the best parsing results.</li>
                    <li>Select your correct career level for more targeted recommendations.</li>
                    <li>The AI focuses on content and keywords, not visual design.</li>
                    <li>Analysis typically takes 10-20 seconds to complete.</li>
                </ul>
            </div>
        </aside>
    );
};



const AnalysisPage = () => {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [careerLevel, setCareerLevel] = useState('Entry-Level');
  const [isDragActive, setIsDragActive] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDownloadPdf = () => {
    if (!taskId) return;
    window.open(`http://127.0.0.1:8000/api/jobs/${taskId}/download/`, '_blank');
  };

  const handleFileChange = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    const maxSizeInBytes = 10 * 1024 * 1024; 
    if (file.size > maxSizeInBytes) {
      setError("File is too large. Please upload a file smaller than 10MB.");
      return;
    }
    setResumeFile(file);
    setError(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragActive(true);
    else if (e.type === "dragleave") setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription) {
      setError("Please provide both a resume PDF and a job description.");
      return;
    }
    setStep(3);
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('resume_pdf', resumeFile);
    formData.append('job_description_text', jobDescription);
    formData.append('career_level', careerLevel);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/analyze/', formData);
      setTaskId(response.data.task_id);
    } catch (err) {
      setError("Failed to start analysis. Please check the server.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!taskId || !isLoading) return;
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${taskId}/`);
        const { status, result: analysisResult } = response.data;
        if (status === 'SUCCESS') {
          clearInterval(interval);
          setIsLoading(false);
          setResult(analysisResult);
        } else if (status === 'FAILURE') {
          clearInterval(interval);
          setIsLoading(false);
          setError(analysisResult?.error || "An unknown error occurred.");
        }
      } catch (err) {
        clearInterval(interval);
        setIsLoading(false);
        setError("Failed to fetch analysis status.");
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [taskId, isLoading]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
            <div className="content-card">
                <h3>Upload Your Resume</h3>
                <p>Start by uploading your resume file for analysis.</p>
                {error && <div className="error-message inline-error">{error}</div>}
                <div className={`upload-zone ${isDragActive ? 'active' : ''}`} onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}>
                    <input type="file" id="file-upload" accept=".pdf" onChange={(e) => handleFileChange(e.target.files[0])} />
                    <UploadCloud size={48} />
                    <p>Drag & drop your resume file here, or <label htmlFor="file-upload" className="browse-link">click to browse</label></p>
                    <span>Supports PDF files up to 10MB</span>
                </div>
                {resumeFile && !error && (<div className="file-display"><FileText size={20} /><span>{resumeFile.name}</span><CheckCircle size={20} color="#2ecc71" /></div>)}
                <div className="file-requirements"><h4>File requirements:</h4><ul><li>Supported formats: PDF</li><li>Maximum file size: 10MB</li><li>Text-based resumes work best (avoid image-based PDFs)</li></ul></div>
                <button className="next-step-btn" disabled={!resumeFile || error} onClick={() => setStep(2)}>Next Step</button>
            </div>
        );
      case 2:
        return (
            <div className="content-card">
                <h3>Configure Analysis</h3>
                <p>Provide a job description and your career level to tailor the analysis.</p>
                <div className="form-group"><label htmlFor="career-level">Career Level</label><select id="career-level" value={careerLevel} onChange={(e) => setCareerLevel(e.target.value)}><option>Entry-Level</option><option>Mid-Level</option><option>Senior-Level</option><option>Manager</option><option>Executive</option></select></div>
                <div className="form-group"><label htmlFor="job-description">Job Description</label><textarea id="job-description" rows="12" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the full job description here..." /></div>
                <div className="button-group"><button className="prev-step-btn" onClick={() => setStep(1)}>Back</button><button className="next-step-btn" disabled={!jobDescription} onClick={handleSubmit}>Analyze & Review</button></div>
            </div>
        );
      case 3:
        if (isLoading) {
          return ( <div className="content-card loading-card"><div className="spinner"></div><h3>Analyzing Your Resume...</h3><p>This may take a minute. Please don't close this page.</p></div> );
        }
        if (result) {
          return (
            <div>
              <div className="results-actions">
                <button className="download-button" onClick={() => { setStep(1); setResult(null); setResumeFile(null); setError(null); }}>
                  Analyze Another
                </button>
                <button className="download-button" onClick={handleDownloadPdf}>
                  <Download size={16} />
                  Download Report
                </button>
              </div>
              <ResultsDisplay result={result} />
            </div>
          );
        }
        if (error) {
          return ( <div className="content-card error-card"><h3>Analysis Failed</h3><p>{error}</p><button className="next-step-btn" onClick={() => { setStep(1); setError(null); setResumeFile(null); }}>Start Over</button></div>);
        }
        return null;
    }
  };

  return (
    <div className="analysis-page-wrapper">
      <header className="analysis-header">
        <Link to="/" className="back-to-home"><ArrowLeft size={20} />Back to Home</Link>
        <span className="step-counter">Step {step} of 3</span>
      </header>
      <main className="analysis-main">
        <Stepper currentStep={step} />
        <div className="content-area">
          {renderStepContent()}
        </div>
        <TipsSidebar />
      </main>
    </div>
  );
};

export default AnalysisPage;
