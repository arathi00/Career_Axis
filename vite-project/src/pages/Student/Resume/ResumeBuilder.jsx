import React, { useState, useEffect } from 'react';
import ResumeTemplates from '../../../components/Resume/ResumeTemplates';
import ResumeForm from '../../../components/Resume/ResumeForm';
import ResumePreview from '../../../components/Resume/ResumePreview';
import { 
  getStudentRegistrationDetails, 
  getSavedResumeData,
  saveResumeData,
  checkAuth,
  testBackendConnection,
  API_URL  // ← ADD THIS IMPORT
} from '../../../services/studentServices';
import './Resume.css';

const ResumeBuilder = () => {
  const [step, setStep] = useState('template');
  const [templateType, setTemplateType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dataSource, setDataSource] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
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
    }]
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
        setResumeData(savedData.resume);
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
      
      let errorMessage = 'Failed to load your data. ';
      
      if (err.response) {
        // Server responded with error
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
        // Request was made but no response
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else {
        // Other errors
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const mapRegistrationToResume = (studentData) => {
    // Map your backend response to resume fields
    return {
      name: studentData.fullName || studentData.name || '',
      email: studentData.email || '',
      phone: studentData.phone || studentData.mobile || '',
      location: studentData.location || 
                `${studentData.city || ''}, ${studentData.state || ''}`.trim() ||
                studentData.address || '',
      linkedin: studentData.linkedin || studentData.linkedInUrl || '',
      github: studentData.github || studentData.githubUrl || studentData.portfolio || '',
      summary: studentData.summary || studentData.bio || studentData.about || 
               `A passionate ${studentData.branch || 'software'} student with ${studentData.cgpa ? `a CGPA of ${studentData.cgpa}` : 'strong academic background'}.`,
      skills: Array.isArray(studentData.skills) 
        ? studentData.skills.join(', ') 
        : studentData.skills || '',
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
      projects: studentData.projects || [{
        title: '',
        technologies: '',
        description: '',
        github: ''
      }],
      certifications: studentData.certifications || [{
        name: '',
        organization: '',
        year: ''
      }]
    };
  };

  const handleTemplateSelect = (templateId) => {
    setTemplateType(templateId);
    setStep('form');
  };

  const handleBack = () => {
    if (step === 'form') {
      setStep('template');
    } else if (step === 'preview') {
      setStep('form');
    }
  };

  const handlePreview = async () => {
    try {
      setSaving(true);
      // Validate required fields
      if (!resumeData.name || !resumeData.email || !resumeData.phone) {
        throw new Error('Please fill in all required fields (Name, Email, Phone)');
      }
      
      // Save resume data before preview
      await saveResumeData(resumeData);
      console.log('Resume data saved successfully');
      setStep('preview');
    } catch (err) {
      console.error('Failed to save resume:', err);
      alert(err.message || 'Failed to save resume data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="resume-builder-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Fetching your data from database...</p>
          <small>Connecting to: http://127.0.0.1:8000</small>
        </div>
      </div>
    );
  }

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
              <p>Backend URL: http://127.0.0.1:8000</p>
              <p>Make sure your backend is running and accessible</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-builder-container">
      <div className="resume-header">
        <h1>CareerAxis Resume Builder</h1>
        <p>Create an ATS-friendly resume that gets you noticed by employers</p>
        
        {dataSource && (
          <div className={`data-source-message ${dataSource}`}>
            <p>
              {dataSource === 'saved' ? '📁 Loaded saved resume' : '✅ Loaded from registration'} 
              {resumeData.name && ` - Welcome, ${resumeData.name}!`}
            </p>
        
          </div>
        )}

        
      </div>

      {step === 'template' && (
        <ResumeTemplates onSelectTemplate={handleTemplateSelect} />
      )}

      {step === 'form' && (
        <ResumeForm
          templateType={templateType}
          resumeData={resumeData}
          setResumeData={setResumeData}
          onBack={handleBack}
          onPreview={handlePreview}
          saving={saving}
          dataSource={dataSource}
        />
      )}

      {step === 'preview' && (
        <ResumePreview
          resumeData={resumeData}
          templateType={templateType}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

// ⭐⭐⭐ MUST ADD THIS LINE AT THE END ⭐⭐⭐
export default ResumeBuilder;