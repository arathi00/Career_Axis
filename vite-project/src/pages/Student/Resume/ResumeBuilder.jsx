import React, { useState, useEffect } from 'react';
import ResumeTemplates from '../../../components/Resume/ResumeTemplates';
import ResumeCredentials from '../../../components/Resume/ResumeCredentials';
import ResumePreview from '../../../components/Resume/ResumePreview';
import AIJobAnalyzer from '../../../components/Resume/AIJobAnalyzer';
import AIResumeOptimizer from '../../../components/Resume/AIResumeOptimizer';
import { 
  getStudentRegistrationDetails, 
  getSavedResumeData,
  saveResumeData,
  checkAuth,
  testBackendConnection,
  API_URL,
  analyzeJobMatch,
  buildAIResume,
  uploadJobDescription
} from '../../../services/studentServices';
import './Resume.css';

const ResumeBuilder = () => {
  // Existing state
  const [step, setStep] = useState('template'); // 'template', 'credentials', 'job-input', 'preview', 'ai-optimize'
  const [templateType, setTemplateType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dataSource, setDataSource] = useState('');
  const [showDebug, setShowDebug] = useState(false);

  // New AI-related state
  const [jobInput, setJobInput] = useState({
    jobTitle: '',
    jobDescription: '',
    useJD: true // true = use JD, false = use job title
  });
  const [jdFile, setJdFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [jobAnalysis, setJobAnalysis] = useState(null);
  const [aiOptimizedResume, setAiOptimizedResume] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Existing resume data state
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    job_objective: '',
    skills: '',
    photo: null,
    education: [{
      school: '',
      branch: '',
      cgpa: '',
      year: ''
    }],
    projects: [{
      title: '',
      technologies: '',
      description: '',
      github: ''
    }],
    certifications: [{
      name: '',
      organization: '',
      year: ''
    }],
    achievements: [], // New field for AI optimization
    technical_skills: [] // New field for better organization
  });

  // Check authentication and fetch data on component mount
  useEffect(() => {
    if (!checkAuth()) {
      setError('Please login to access the resume builder');
      setLoading(false);
      return;
    }

    fetchStudentData();
  }, []);

  // Fetch student data from backend
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get saved resume data first
      let savedData = null;
      try {
        savedData = await getSavedResumeData();
      } catch (err) {
        console.log('No saved resume data found, fetching registration data...');
      }

      if (savedData && savedData.resume) {
        // Load saved resume data
        setResumeData(prev => ({
          ...prev,
          ...savedData.resume,
          // Ensure arrays exist
          technical_skills: savedData.resume.technical_skills || [],
          achievements: savedData.resume.achievements || []
        }));
        setDataSource('saved');
        console.log('Loaded saved resume data');
      } else {
        // Fetch fresh registration data from database
        const studentData = await getStudentRegistrationDetails();

        if (!studentData) {
          throw new Error('No student data found');
        }

        // Map registration data to resume data format
        const mappedResumeData = mapRegistrationToResume(studentData);
        setResumeData(mappedResumeData);
        setDataSource('registration');
        console.log('Loaded fresh registration data');
      }

    } catch (err) {
      console.error('Failed to fetch student data:', err);
      handleFetchError(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle fetch errors
  const handleFetchError = (err) => {
    let errorMessage = 'Failed to load your data. ';

    if (err.response) {
      switch (err.response.status) {
        case 401:
          errorMessage = 'Session expired. Please login again.';
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          break;
        case 404:
          errorMessage = 'Student data not found. Please complete your registration first.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = err.response.data?.message || errorMessage;
      }
    } else if (err.request) {
      errorMessage = 'Cannot connect to server. Please check your internet connection.';
    } else {
      errorMessage = err.message || errorMessage;
    }

    setError(errorMessage);
  };

  // Map registration data to resume format
  const mapRegistrationToResume = (studentData) => {
    // Convert skills string to array
    const skillsArray = typeof studentData.skills === 'string'
      ? studentData.skills.split(',').map(s => s.trim())
      : Array.isArray(studentData.skills)
        ? studentData.skills
        : [];

    return {
      name: studentData.fullName || studentData.name || '',
      email: studentData.email || '',
      phone: studentData.phone || studentData.mobile || '',
      location: studentData.location ||
        `${studentData.city || ''}, ${studentData.state || ''}`.trim() ||
        studentData.address || '',
      linkedin: studentData.linkedin || studentData.linkedInUrl || '',
      github: studentData.github || studentData.githubUrl || studentData.portfolio || '',
      job_objective: studentData.job_objective || studentData.jobRole || studentData.targetRole || '',
      summary: studentData.summary || studentData.bio || studentData.about ||
        `A passionate ${studentData.branch || 'software'} student with ${studentData.cgpa ? `a CGPA of ${studentData.cgpa}` : 'strong academic background'}.`,
      skills: skillsArray.join(', '),
      technical_skills: skillsArray,
      photo: studentData.photo || studentData.profilePhoto || studentData.avatar || null,
      education: studentData.education && studentData.education.length > 0
        ? studentData.education.map(edu => ({
          school: edu.school || edu.college || edu.university || '',
          branch: edu.branch || edu.course || edu.department || '',
          cgpa: edu.cgpa?.toString() || edu.gpa?.toString() || '',
          year: edu.year?.toString() || edu.graduationYear?.toString() || ''
        }))
        : [{
          school: studentData.college || studentData.university || studentData.institution || '',
          branch: studentData.branch || studentData.course || studentData.department || '',
          cgpa: studentData.cgpa?.toString() || studentData.gpa?.toString() || '',
          year: studentData.graduationYear?.toString() ||
            studentData.passingYear?.toString() ||
            studentData.yearOfGraduation?.toString() || ''
        }],
      projects: studentData.projects && studentData.projects.length > 0
        ? studentData.projects
        : [{
          title: '',
          technologies: '',
          description: '',
          github: ''
        }],
      certifications: studentData.certifications || [{
        name: '',
        organization: '',
        year: ''
      }],
      achievements: studentData.achievements || []
    };
  };

  // Handle template selection
  const handleTemplateSelect = (templateId) => {
    setTemplateType(templateId);
    // Show credentials step after template selection
    setStep('credentials');
  };

  // Handle back navigation
  const handleBack = () => {
    switch (step) {
      case 'credentials':
        setStep('template');
        break;
      case 'job-input':
        setStep('credentials');
        break;
      case 'preview':
        setStep('job-input');
        break;
      case 'ai-optimize':
        setStep('preview');
        break;
      default:
        setStep('template');
    }
  };

// Handle preview with save - moved save logic to credentials step
  const handlePreview = async () => {
    try {
      setStep('preview');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Handle credentials completion
  const handleCredentialsComplete = async (credentialsData) => {
    try {
      // Update resume data with credentials
      setResumeData(credentialsData);

      // Transform credentials to match backend SaveResumeRequest schema
      const payload = {
        phone: credentialsData.phone || '',
        technical_skills: (credentialsData.skills || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        key_strength: credentialsData.summary || '',
        job_role: credentialsData.job_objective || '',
        domain: credentialsData.job_objective || '',
        tools: [],
        internships: (credentialsData.internships || []).filter(
          item => item.company || item.position || item.description
        ),
        certifications: (credentialsData.certifications || []).filter(
          item => item.name || item.organization || item.year
        ),
        achievements: (credentialsData.achievements || []).filter(Boolean),
        languages: (credentialsData.languages || []).filter(Boolean)
      };

      // Save to backend
      await saveResumeData(payload);

      // Move to job input step
      setStep('job-input');
    } catch (err) {
      console.error('Failed to save credentials - Full error:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to save profile data';
      alert(`Error: ${errorMsg}`);
    }
  };

  // ============ NEW AI FUNCTIONS ============

  // Handle job description file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setJdFile(file);
    setAiLoading(true);
    setAiError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadJobDescription(formData, (progress) => {
        setUploadProgress(progress);
      });

      if (result.success && result.parsed_data) {
        // Auto-fill job description with parsed data
        setJobInput({
          ...jobInput,
          jobDescription: result.parsed_data.job_description || jobInput.jobDescription,
          jobTitle: result.parsed_data.job_title || jobInput.jobTitle
        });

        // Also set the analysis with parsed data
        setJobAnalysis({
          job_title: result.parsed_data.job_title,
          required_skills: result.parsed_data.required_skills || [],
          responsibilities: result.parsed_data.responsibilities || [],
          experience_level: result.parsed_data.experience_level || '',
          industry: result.parsed_data.industry || ''
        });
      }
    } catch (err) {
      setAiError('Failed to upload and parse JD file');
      console.error('Upload error:', err);
    } finally {
      setAiLoading(false);
      setUploadProgress(0);
    }
  };

  // Analyze job match
  const handleAnalyzeJob = async () => {
    if (!jobInput.jobTitle && !jobInput.jobDescription) {
      setAiError('Please enter Job Title or upload Job Description');
      return;
    }

    setAiLoading(true);
    setAiError('');

    try {
      const result = await analyzeJobMatch({
        job_title: jobInput.jobTitle,
        job_description: jobInput.jobDescription,
        student_data: {
          summary: resumeData.summary,
          technical_skills: (resumeData.technical_skills && resumeData.technical_skills.length > 0)
            ? resumeData.technical_skills
            : (resumeData.skills || '').split(',').map(s => s.trim()).filter(s => s),
          projects: resumeData.projects,
          achievements: resumeData.achievements,
          education: resumeData.education
        }
      });

      if (result.success && result.analysis) {
        setJobAnalysis(result.analysis);
      }
    } catch (err) {
      setAiError(err.message || 'Job analysis failed');
    } finally {
      setAiLoading(false);
    }
  };

  // Build AI-powered resume
  const handleBuildAIResume = async () => {
    if (!jobInput.jobTitle && !jobInput.jobDescription) {
      setAiError('Please provide job details first');
      return;
    }

    setAiLoading(true);
    setAiError('');

    try {
      // Prepare student data for AI
      const studentDataForAI = {
        name: resumeData.name,
        email: resumeData.email,
        phone: resumeData.phone,
        summary: resumeData.summary,
        technical_skills: (resumeData.technical_skills && resumeData.technical_skills.length > 0)
          ? resumeData.technical_skills
          : (resumeData.skills || '').split(',').map(s => s.trim()).filter(s => s),
        projects: resumeData.projects.map(p => ({
          name: p.title,
          description: p.description,
          technologies: p.technologies ? p.technologies.split(',').map(t => t.trim()) : []
        })),
        achievements: resumeData.achievements,
        education: resumeData.education,
        certifications: resumeData.certifications
      };

      const result = await buildAIResume({
        job_title: jobInput.jobTitle,
        job_description: jobInput.jobDescription,
        student_data: studentDataForAI
      });

      if (result.success && result.resume) {
        setAiOptimizedResume(result.resume);

        // Update resume data with AI-optimized content
        const updatedResumeData = { ...resumeData };

        // Update summary if AI generated one
        if (result.resume.professional_summary) {
          updatedResumeData.summary = result.resume.professional_summary;
        }

        // Update skills with prioritized order
        if (result.resume.skills?.technical_skills) {
          updatedResumeData.technical_skills = result.resume.skills.technical_skills;
          updatedResumeData.skills = result.resume.skills.technical_skills.join(', ');
        }

        // Update projects with enhanced descriptions
        if (result.resume.projects && result.resume.projects.length > 0) {
          updatedResumeData.projects = result.resume.projects.map(p => ({
            title: p.name || p.title,
            description: p.description,
            technologies: p.technologies ? p.technologies.join(', ') : '',
            github: ''
          }));
        }

        // Update achievements
        if (result.resume.achievements && result.resume.achievements.length > 0) {
          updatedResumeData.achievements = result.resume.achievements;
        }

        setResumeData(updatedResumeData);

        // Show success message
        alert(`✅ Resume optimized! ATS Score: ${result.resume.ats_analysis?.score || 'N/A'}/100`);

        // Move to preview step to review changes
        setStep('preview');
      }
    } catch (err) {
      setAiError(err.message || 'AI resume building failed');
    } finally {
      setAiLoading(false);
    }
  };

  // Skip AI and go to form directly
  const handleSkipAI = () => {
    setStep('form');
  };

  // Render loading state
  if (loading) {
    return (
      <div className="resume-builder-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Fetching your data from database...</p>
          <small>Connecting to: {API_URL || 'http://127.0.0.1:8000'}</small>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="resume-builder-container">
        <div className="error-fullscreen">
          <div className="error-content">
            <h2>Unable to Load Resume Builder</h2>
            <p className="error-text">{error}</p>
            <div className="error-actions">
              <button onClick={fetchStudentData} className="retry-btn">
                Retry
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="login-btn"
              >
                Go to Login
              </button>
              <button
                onClick={() => window.location.href = '/register'}
                className="register-btn"
              >
                Register
              </button>
            </div>
            <div className="debug-info">
              <p><strong>Debug Info:</strong></p>
              <p>Backend URL: {API_URL || 'http://127.0.0.1:8000'}</p>
              <button onClick={() => testBackendConnection()} className="test-btn">
                Test Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-builder-container">
      <div className="resume-header">
        <h1>CareerAxis AI Resume Builder</h1>
        <p>Create an ATS-optimized resume tailored to your dream job</p>

        {dataSource && (
          <div className={`data-source-message ${dataSource}`}>
            <p>
              {dataSource === 'saved' ? '📁 Loaded saved resume' : '✅ Loaded from registration'}
              {resumeData.name && ` - Welcome, ${resumeData.name}!`}
            </p>
          </div>
        )}
      </div>

      {/* Step 1: Template Selection */}
      {step === 'template' && (
        <ResumeTemplates onSelectTemplate={handleTemplateSelect} />
      )}

      {/* Step 2: Credentials/Profile Information */}
      {step === 'credentials' && (
        <ResumeCredentials
          initialData={resumeData}
          onNext={handleCredentialsComplete}
          onBack={handleBack}
          loading={loading}
        />
      )}

      {/* Step 3: Job Input & AI Analysis */}
      {step === 'job-input' && (
        <AIJobAnalyzer
          jobInput={jobInput}
          setJobInput={setJobInput}
          jdFile={jdFile}
          onFileUpload={handleFileUpload}
          uploadProgress={uploadProgress}
          loading={aiLoading}
          error={aiError}
          jobAnalysis={jobAnalysis}
          onAnalyze={handleAnalyzeJob}
          onBuildResume={handleBuildAIResume}
          onSkip={handleSkipAI}
          onBack={handleBack}
        />
      )}

      {/* Step 4: Resume Preview */}
      {step === 'preview' && (
        <>
          <ResumePreview
            resumeData={resumeData}
            templateType={templateType}
            onBack={handleBack}
          />

          {/* AI Re-optimize Button in Preview */}
          {aiOptimizedResume && (
            <div className="preview-actions">
              <button
                className="ai-optimize-btn"
                onClick={() => setStep('ai-optimize')}
              >
                🤖 View AI Analysis
              </button>
            </div>
          )}
        </>
      )}

      {/* Step 5: AI Optimization Results (Optional) */}
      {step === 'ai-optimize' && aiOptimizedResume && (
        <AIResumeOptimizer
          aiResume={aiOptimizedResume}
          onBack={handleBack}
          onApply={() => setStep('preview')}
        />
      )}
    </div>
  );
};

export default ResumeBuilder;