import React, { useState, useEffect } from 'react';
import '../../pages/Student/Resume/Resume.css';
import FreeAIEnhancer from './FreeAIEnhancer.jsx';

const ResumeForm = ({ 
  templateType, 
  resumeData, 
  setResumeData, 
  onBack, 
  onPreview,
  saving = false,
  dataSource = ''
}) => {
  const [photo, setPhoto] = useState(resumeData.photo);
  const [isDragging, setIsDragging] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState({});

  // Update photo when resumeData changes
  useEffect(() => {
    setPhoto(resumeData.photo);
  }, [resumeData.photo]);

  // Check which fields are auto-filled
  useEffect(() => {
    const autoFilled = {
      name: !!resumeData.name,
      email: !!resumeData.email,
      phone: false,                    // CHANGED: Disable auto-fill for phone
      location: false,                 // CHANGED: Disable auto-fill for location
      education: resumeData.education.length > 0 && 
                (!!resumeData.education[0].school || 
                 !!resumeData.education[0].branch),
      skills: !!resumeData.skills,
      summary: !!resumeData.summary,
      linkedin: false,                 // CHANGED: Disable auto-fill for linkedin
      github: false                    // CHANGED: Disable auto-fill for github
    };
    setAutoFilledFields(autoFilled);
  }, [resumeData]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, JPG)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        setResumeData({...resumeData, photo: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setResumeData({...resumeData, photo: null});
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handlePhotoUpload({ target: { files } });
    }
  };

  const handleInputChange = (section, index, field, value) => {
    const updatedData = {...resumeData};
    if (index !== undefined) {
      updatedData[section][index][field] = value;
    } else {
      updatedData[section] = value;
    }
    setResumeData(updatedData);
  };

  // ADD THIS NEW FUNCTION for simpler field changes
  const handleSimpleChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addEntry = (section) => {
    const template = {
      education: { school: '', branch: '', cgpa: '', year: '' },
      projects: { title: '', technologies: '', description: '', github: '' },
      certifications: { name: '', organization: '', year: '' }
    };
    
    setResumeData({
      ...resumeData,
      [section]: [...resumeData[section], template[section]]
    });
  };

  // const removeEntry = (section, index) => {
  //   if (section === 'education' && resumeData.education.length <= 1) {
  //     alert('At least one education entry is required');
  //     return;
  //   }
    
  //   const updatedEntries = resumeData[section].filter((_, i) => i !== index);
  //   setResumeData({...resumeData, [section]: updatedEntries});
  // };
  const removeEntry = (section, index) => {
  // Don't allow removing the first education entry (registration data)
  if (section === 'education' && index === 0) {
    alert('This education entry is from your registration and cannot be removed');
    return;
  }
  
  if (section === 'education' && resumeData.education.length <= 1) {
    alert('At least one education entry is required');
    return;
  }
  
  const updatedEntries = resumeData[section].filter((_, i) => i !== index);
  setResumeData({...resumeData, [section]: updatedEntries});
};

  return (
    <div className="form-section">
      <div className="section-header">
        <h2>Build Your Resume</h2>
        <div className="header-info">
          <span className="template-type">
            {templateType === 1 ? 'Without Photo' : 'With Photo'} Template
          </span>
          {dataSource && (
            <span className="data-source-indicator">
              {dataSource === 'saved' ? '📁 Editing saved resume' : '✅ Auto-filled from registration'}
            </span>
          )}
        </div>
      </div>

      {templateType === 2 && (
        <div className="photo-upload-section">
          <h3>Upload Your Professional Photo</h3>
          <p>Recommended: Professional headshot, 2:3 aspect ratio (passport size), max 5MB</p>
          
          <div className="photo-container">
            {photo ? (
              <>
                <img src={photo} alt="Preview" className="photo-preview" />
                <div className="photo-actions">
                  <input
                    type="file"
                    id="photo-upload-change"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="photo-upload-change" className="upload-btn secondary-btn">
                    Change Photo
                  </label>
                  <button className="remove-btn" onClick={handleRemovePhoto}>
                    Remove Photo
                  </button>
                </div>
              </>
            ) : (
              <div 
                className={`photo-upload-area ${isDragging ? 'dragover' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('photo-upload').click()}
              >
                <div className="upload-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p>Drag & drop your photo here or click to browse</p>
                <p className="file-types">JPEG, PNG - Max 5MB</p>
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="photo-upload" className="upload-btn">
                  Browse Files
                </label>
              </div>
            )}
          </div>
          
          <div className="photo-instructions">
            <h4>Photo Guidelines:</h4>
            <ul>
              <li>Use a recent, professional headshot</li>
              <li>Plain, light-colored background recommended</li>
              <li>Face should be clearly visible (no sunglasses)</li>
              <li>Professional attire required</li>
              <li>Smile naturally</li>
            </ul>
          </div>
        </div>
      )}

      <div className="resume-form">
        <div className={`form-group ${autoFilledFields.name ? 'auto-filled' : ''}`}>
          <label>
            Full Name *
            {autoFilledFields.name && <span className="auto-fill-indicator">Auto-filled</span>}
          </label>
          <input
            type="text"
            value={resumeData.name}
            onChange={(e) => handleInputChange('name', null, null, e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className={`form-group ${autoFilledFields.email ? 'auto-filled' : ''}`}>
          <label>
            Email *
            {autoFilledFields.email && <span className="auto-fill-indicator">Auto-filled</span>}
          </label>
          <input
            type="email"
            value={resumeData.email}
            onChange={(e) => handleInputChange('email', null, null, e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>

        {/* Phone Field - FIXED */}
        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            value={resumeData.phone || ''}
            onChange={(e) => handleSimpleChange('phone', e.target.value)}
            placeholder="+91 12345 67890"
            required
          />
        </div>

        {/* Location Field - FIXED */}
        <div className="form-group">
          <label>Location (City, State) *</label>
          <input
            type="text"
            value={resumeData.location || ''}
            onChange={(e) => handleSimpleChange('location', e.target.value)}
            placeholder="Trivandum, Kerala"
            required
          />
        </div>

        {/* LinkedIn Field - FIXED */}
        <div className="form-group">
          <label>LinkedIn URL</label>
          <input
            type="url"
            value={resumeData.linkedin || ''}
            onChange={(e) => handleSimpleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        {/* GitHub Field - FIXED */}
        <div className="form-group">
          <label>GitHub / Portfolio URL</label>
          <input
            type="url"
            value={resumeData.github || ''}
            onChange={(e) => handleSimpleChange('github', e.target.value)}
            placeholder="https://github.com/username"
          />
        </div>

        <div className={`form-group ${autoFilledFields.summary ? 'auto-filled' : ''}`}>
          <label>
            Professional Summary
            {autoFilledFields.summary && <span className="auto-fill-indicator">Auto-filled</span>}
          </label>
          <textarea
            value={resumeData.summary}
            onChange={(e) => handleInputChange('summary', null, null, e.target.value)}
            placeholder="Experienced software developer with 5+ years in web development..."
            rows="4"
          />
        </div>

        {/* Education Section */}
        {/* <div className="section-block">
          <h3>
            Education Details
            <button className="add-btn" onClick={() => addEntry('education')}>
              + Add Education
            </button>
          </h3>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="entry-item">
              <div className={`form-group ${autoFilledFields.education && index === 0 ? 'auto-filled' : ''}`}>
                <label>
                  School/College Name *
                  {autoFilledFields.education && index === 0 && <span className="auto-fill-indicator">Auto-filled</span>}
                </label>
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => handleInputChange('education', index, 'school', e.target.value)}
                  placeholder="University of Example"
                  required
                />
              </div>
              <div className={`form-group ${autoFilledFields.education && index === 0 ? 'auto-filled' : ''}`}>
                <label>
                  Branch/Field of Study *
                  {autoFilledFields.education && index === 0 && <span className="auto-fill-indicator">Auto-filled</span>}
                </label>
                <input
                  type="text"
                  value={edu.branch}
                  onChange={(e) => handleInputChange('education', index, 'branch', e.target.value)}
                  placeholder="Computer Science"
                  required
                />
              </div>
              <div className={`form-group ${autoFilledFields.education && index === 0 ? 'auto-filled' : ''}`}>
                <label>
                  CGPA/Percentage *
                  {autoFilledFields.education && index === 0 && <span className="auto-fill-indicator">Auto-filled</span>}
                </label>
                <input
                  type="text"
                  value={edu.cgpa}
                  onChange={(e) => handleInputChange('education', index, 'cgpa', e.target.value)}
                  placeholder="3.8/4.0 or 90%"
                  required
                />
              </div>
              <div className={`form-group ${autoFilledFields.education && index === 0 ? 'auto-filled' : ''}`}>
                <label>
                  Graduation Year *
                  {autoFilledFields.education && index === 0 && <span className="auto-fill-indicator">Auto-filled</span>}
                </label>
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => handleInputChange('education', index, 'year', e.target.value)}
                  placeholder="2023"
                  required
                />
              </div>
              {resumeData.education.length > 1 && (
                <button className="remove-btn" onClick={() => removeEntry('education', index)}>
                  Remove Education
                </button>
              )}
            </div>
          ))}
        </div> */}

        <div className="section-block">
  <h3>
    Education Details
    <button className="add-btn" onClick={() => addEntry('education')}>
      + Add Education
    </button>
  </h3>
  {resumeData.education.map((edu, index) => (
    <div key={index} className="entry-item">
      {/* School/College - READ-ONLY for first entry */}
      <div className={`form-group ${autoFilledFields.education && index === 0 ? 'auto-filled read-only' : ''}`}>
        <label>
          School/College Name *
          {autoFilledFields.education && index === 0 && <span className="auto-fill-indicator">Auto-filled (Read-only)</span>}
        </label>
        <input
          type="text"
          value={edu.school}
          onChange={(e) => handleInputChange('education', index, 'school', e.target.value)}
          placeholder="University of Example"
          required
          readOnly={index === 0}
          className={index === 0 ? 'read-only-input' : ''}
        />
      </div>
      
      {/* Branch - READ-ONLY for first entry */}
      <div className={`form-group ${autoFilledFields.education && index === 0 ? 'auto-filled read-only' : ''}`}>
        <label>
          Branch/Field of Study *
          {autoFilledFields.education && index === 0 && <span className="auto-fill-indicator">Auto-filled (Read-only)</span>}
        </label>
        <input
          type="text"
          value={edu.branch}
          onChange={(e) => handleInputChange('education', index, 'branch', e.target.value)}
          placeholder="Computer Science"
          required
          readOnly={index === 0}
          className={index === 0 ? 'read-only-input' : ''}
        />
      </div>
      
      {/* CGPA - READ-ONLY for first entry */}
      <div className={`form-group ${autoFilledFields.education && index === 0 ? 'auto-filled read-only' : ''}`}>
        <label>
          CGPA/Percentage *
          {autoFilledFields.education && index === 0 && <span className="auto-fill-indicator">Auto-filled (Read-only)</span>}
        </label>
        <input
          type="text"
          value={edu.cgpa}
          onChange={(e) => handleInputChange('education', index, 'cgpa', e.target.value)}
          placeholder="3.8/4.0 or 90%"
          required
          readOnly={index === 0}
          className={index === 0 ? 'read-only-input' : ''}
        />
      </div>
      
      {/* Year - READ-ONLY for first entry */}
      <div className={`form-group ${autoFilledFields.education && index === 0 ? 'auto-filled read-only' : ''}`}>
        <label>
          Graduation Year *
          {autoFilledFields.education && index === 0 && <span className="auto-fill-indicator">Auto-filled (Read-only)</span>}
        </label>
        <input
          type="text"
          value={edu.year}
          onChange={(e) => handleInputChange('education', index, 'year', e.target.value)}
          placeholder="2023"
          required
          readOnly={index === 0}
          className={index === 0 ? 'read-only-input' : ''}
        />
      </div>
      
      {/* Don't allow removing the first (registration) education entry */}
      {resumeData.education.length > 1 && index > 0 && (
        <button className="remove-btn" onClick={() => removeEntry('education', index)}>
          Remove Education
        </button>
      )}
    </div>
  ))}
</div>

        {/* Projects Section */}
        <div className="section-block">
          <h3>
            Projects
            <button className="add-btn" onClick={() => addEntry('projects')}>
              + Add Project
            </button>
          </h3>
          {resumeData.projects.map((project, index) => (
            <div key={index} className="entry-item">
              <h4>Project #{index + 1}</h4>
              <div className="form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleInputChange('projects', index, 'title', e.target.value)}
                  placeholder="E-commerce Website"
                  required
                />
              </div>
              <div className="form-group">
                <label>Technologies Used *</label>
                <input
                  type="text"
                  value={project.technologies}
                  onChange={(e) => handleInputChange('projects', index, 'technologies', e.target.value)}
                  placeholder="React, Node.js, MongoDB"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description (ATS-friendly bullets)</label>
                <textarea
                  value={project.description}
                  onChange={(e) => handleInputChange('projects', index, 'description', e.target.value)}
                  placeholder="• Developed full-stack e-commerce platform with payment integration...
• Implemented responsive design for mobile and desktop..."
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>GitHub Link (optional)</label>
                <input
                  type="url"
                  value={project.github}
                  onChange={(e) => handleInputChange('projects', index, 'github', e.target.value)}
                  placeholder="https://github.com/username/project"
                />
              </div>
              <button className="remove-btn" onClick={() => removeEntry('projects', index)}>
                Remove Project
              </button>
            </div>
          ))}
        </div>

        {/* Certifications Section */}
        <div className="section-block">
          <h3>
            Certifications
            <button className="add-btn" onClick={() => addEntry('certifications')}>
              + Add Certification
            </button>
          </h3>
          {resumeData.certifications.map((cert, index) => (
            <div key={index} className="entry-item">
              <div className="form-group">
                <label>Certification Name *</label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => handleInputChange('certifications', index, 'name', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                  required
                />
              </div>
              <div className="form-group">
                <label>Issuing Organization *</label>
                <input
                  type="text"
                  value={cert.organization}
                  onChange={(e) => handleInputChange('certifications', index, 'organization', e.target.value)}
                  placeholder="Amazon Web Services"
                  required
                />
              </div>
              <div className="form-group">
                <label>Year *</label>
                <input
                  type="text"
                  value={cert.year}
                  onChange={(e) => handleInputChange('certifications', index, 'year', e.target.value)}
                  placeholder="2023"
                  required
                />
              </div>
              <button className="remove-btn" onClick={() => removeEntry('certifications', index)}>
                Remove Certification
              </button>
            </div>
          ))}
        </div>

        {/* Skills Section */}
<div className="section-block">
  <h3>Skills</h3>
  <div className={`form-group ${autoFilledFields.skills ? 'auto-filled' : ''}`}>
    <label>
      Technical Skills (comma separated)
      {autoFilledFields.skills && <span className="auto-fill-indicator">Auto-filled</span>}
    </label>
    <textarea
      value={resumeData.skills}
      onChange={(e) => handleSimpleChange('skills', e.target.value)}
      placeholder="React, Node.js, Python, AWS, Docker"
      rows="3"
    />
    {autoFilledFields.skills && (
      <p className="help-text">
        Pre-filled from your registration. You can add more skills separated by commas.
      </p>
    )}
  </div>
</div>


<div className="section-block">
  <FreeAIEnhancer 
    resumeData={resumeData}
    onUpdate={setResumeData}
  />
</div>

        <div className="action-buttons">
          <button className="back-btn" onClick={onBack} disabled={saving}>
            Back to Templates
          </button>
          <button 
            className="preview-btn" 
            onClick={onPreview}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-small"></span> Saving...
              </>
            ) : 'Preview Resume'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;