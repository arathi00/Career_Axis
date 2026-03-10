import React, { useState, useEffect } from 'react';
import { getStudentRegistrationDetails } from '../../services/studentServices';
import './ResumeCredentials.css';

const ResumeCredentials = ({ initialData, onNext, onBack, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    job_objective: '',
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
    internships: [{
      company: '',
      position: '',
      duration: '',
      description: ''
    }],
    certifications: [{
      name: '',
      organization: '',
      year: ''
    }],
    achievements: [''],
    languages: ['']
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Fetch data on mount
  useEffect(() => {
    fetchStudentData();
  }, []);

  // Fetch student registration data
  const fetchStudentData = async () => {
    try {
      setIsLoading(true);
      setLoadError('');
      
      const studentData = await getStudentRegistrationDetails();
      
      if (studentData) {
        // Map registration data to form data
        const skillsArray = typeof studentData.profile?.skills === 'string' 
          ? studentData.profile.skills.split(',').map(s => s.trim())
          : Array.isArray(studentData.profile?.skills) 
            ? studentData.profile.skills 
            : [];

        setFormData(prev => ({
          ...prev,
          name: studentData.user?.name || '',
          email: studentData.user?.email || '',
          phone: studentData.resume?.phone || '',
          job_objective: studentData.resume?.job_role || studentData.profile?.jobRole || '',
          summary: studentData.resume?.key_strength || '',
          skills: skillsArray.join(', '),
          education: [{
            school: studentData.profile?.college || '',
            branch: studentData.profile?.course || '',
            cgpa: studentData.profile?.cgpa?.toString() || '',
            year: studentData.profile?.graduation_year?.toString() || ''
          }],
          projects: studentData.resume?.projects || [{
            title: '',
            technologies: '',
            description: '',
            github: ''
          }],
          internships: studentData.resume?.internships || [{
            company: '',
            position: '',
            duration: '',
            description: ''
          }],
          certifications: studentData.resume?.certifications || [{
            name: '',
            organization: '',
            year: ''
          }],
          achievements: studentData.resume?.achievements || [''],
          languages: studentData.resume?.languages || ['']
        }));
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      setLoadError('Could not load your profile data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle text input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle array field change (education, projects, etc.)
  const handleArrayChange = (section, index, field, value) => {
    setFormData(prev => {
      const updated = [...prev[section]];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return {
        ...prev,
        [section]: updated
      };
    });
  };

  // Add new item to array field
  const addArrayItem = (section) => {
    const templates = {
      education: { school: '', branch: '', cgpa: '', year: '' },
      projects: { title: '', technologies: '', description: '', github: '' },
      internships: { company: '', position: '', duration: '', description: '' },
      certifications: { name: '', organization: '', year: '' },
      achievements: '',
      languages: ''
    };
    
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], templates[section]]
    }));
  };

  // Remove item from array field
  const removeArrayItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // Handle array string field change
  const handleArrayStringChange = (section, index, value) => {
    setFormData(prev => {
      const updated = [...prev[section]];
      updated[index] = value;
      return {
        ...prev,
        [section]: updated
      };
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.job_objective.trim()) newErrors.job_objective = 'Career objective/job title is required';
    if (!formData.education[0]?.school) newErrors.education = 'At least one education entry required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className="resume-credentials-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading your profile information...</p>
        </div>
      )}
      
      {loadError && (
        <div className="error-banner">
          <p>⚠️ {loadError}</p>
          <button onClick={fetchStudentData} className="btn-retry">Retry</button>
        </div>
      )}

      <div className="credentials-form">
        <h2>📋 Complete Your Profile Information</h2>
        <p className="subtitle">All fields marked with * are required</p>

        {/* BASIC INFORMATION */}
        <section className="form-section">
          <h3>👤 Basic Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-msg">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, State"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div className="form-group">
              <label>GitHub/Portfolio URL</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                placeholder="https://github.com/yourprofile"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Career Objective / Target Job Title *</label>
            <input
              type="text"
              name="job_objective"
              value={formData.job_objective}
              onChange={handleInputChange}
              placeholder="e.g., Software Engineer, Full Stack Developer, Data Analyst"
              className={errors.job_objective ? 'error' : ''}
            />
            {errors.job_objective && <span className="error-msg">{errors.job_objective}</span>}
            <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
              Specify the job role you're targeting to get AI-optimized summary
            </small>
          </div>

          <div className="form-group full-width">
            <label>Skills (comma-separated)</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="e.g., Java, Python, React, Node.js, SQL..."
              rows="2"
            />
          </div>
        </section>

        {/* EDUCATION */}
        <section className="form-section">
          <div className="section-header">
            <h3>🎓 Education *</h3>
            <button 
              type="button"
              onClick={() => addArrayItem('education')}
              className="btn-add"
            >
              + Add Education
            </button>
          </div>

          {formData.education.map((edu, index) => (
            <div key={index} className="array-item">
              <div className="item-number">Education {index + 1}</div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>School/University *</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)}
                    placeholder="Enter school/university name"
                  />
                </div>

                <div className="form-group">
                  <label>Course/Branch *</label>
                  <input
                    type="text"
                    value={edu.branch}
                    onChange={(e) => handleArrayChange('education', index, 'branch', e.target.value)}
                    placeholder="e.g., B.Tech Computer Science"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>CGPA/GPA</label>
                  <input
                    type="text"
                    value={edu.cgpa}
                    onChange={(e) => handleArrayChange('education', index, 'cgpa', e.target.value)}
                    placeholder="e.g., 3.8"
                  />
                </div>

                <div className="form-group">
                  <label>Graduation Year</label>
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>

              {formData.education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('education', index)}
                  className="btn-remove"
                >
                  ✕ Remove
                </button>
              )}
            </div>
          ))}
          {errors.education && <span className="error-msg">{errors.education}</span>}
        </section>

        {/* PROJECTS */}
        <section className="form-section">
          <div className="section-header">
            <h3>💻 Projects</h3>
            <button 
              type="button"
              onClick={() => addArrayItem('projects')}
              className="btn-add"
            >
              + Add Project
            </button>
          </div>

          {formData.projects.map((project, index) => (
            <div key={index} className="array-item">
              <div className="item-number">Project {index + 1}</div>

              <div className="form-group full-width">
                <label>Project Title</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)}
                  placeholder="Enter project title"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Technologies Used</label>
                  <input
                    type="text"
                    value={project.technologies}
                    onChange={(e) => handleArrayChange('projects', index, 'technologies', e.target.value)}
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </div>

                <div className="form-group">
                  <label>GitHub Link</label>
                  <input
                    type="url"
                    value={project.github}
                    onChange={(e) => handleArrayChange('projects', index, 'github', e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Project Description</label>
                <textarea
                  value={project.description}
                  onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                  placeholder="Describe your project..."
                  rows="2"
                />
              </div>

              {formData.projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('projects', index)}
                  className="btn-remove"
                >
                  ✕ Remove
                </button>
              )}
            </div>
          ))}
        </section>

        {/* INTERNSHIPS */}
        <section className="form-section">
          <div className="section-header">
            <h3>🏢 Internships/Work Experience</h3>
            <button 
              type="button"
              onClick={() => addArrayItem('internships')}
              className="btn-add"
            >
              + Add Experience
            </button>
          </div>

          {formData.internships.map((internship, index) => (
            <div key={index} className="array-item">
              <div className="item-number">Experience {index + 1}</div>

              <div className="form-row">
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={internship.company}
                    onChange={(e) => handleArrayChange('internships', index, 'company', e.target.value)}
                    placeholder="Company name"
                  />
                </div>

                <div className="form-group">
                  <label>Position/Role</label>
                  <input
                    type="text"
                    value={internship.position}
                    onChange={(e) => handleArrayChange('internships', index, 'position', e.target.value)}
                    placeholder="Job title"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Duration (e.g., Jan 2023 - Jun 2023)</label>
                <input
                  type="text"
                  value={internship.duration}
                  onChange={(e) => handleArrayChange('internships', index, 'duration', e.target.value)}
                  placeholder="Duration"
                />
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  value={internship.description}
                  onChange={(e) => handleArrayChange('internships', index, 'description', e.target.value)}
                  placeholder="What did you do?"
                  rows="2"
                />
              </div>

              {formData.internships.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('internships', index)}
                  className="btn-remove"
                >
                  ✕ Remove
                </button>
              )}
            </div>
          ))}
        </section>

        {/* CERTIFICATIONS */}
        <section className="form-section">
          <div className="section-header">
            <h3>🏆 Certifications</h3>
            <button 
              type="button"
              onClick={() => addArrayItem('certifications')}
              className="btn-add"
            >
              + Add Certification
            </button>
          </div>

          {formData.certifications.map((cert, index) => (
            <div key={index} className="array-item">
              <div className="item-number">Certification {index + 1}</div>

              <div className="form-row">
                <div className="form-group">
                  <label>Certification Name</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleArrayChange('certifications', index, 'name', e.target.value)}
                    placeholder="Certification name"
                  />
                </div>

                <div className="form-group">
                  <label>Issued By</label>
                  <input
                    type="text"
                    value={cert.organization}
                    onChange={(e) => handleArrayChange('certifications', index, 'organization', e.target.value)}
                    placeholder="Organization name"
                  />
                </div>

                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="text"
                    value={cert.year}
                    onChange={(e) => handleArrayChange('certifications', index, 'year', e.target.value)}
                    placeholder="Year"
                  />
                </div>
              </div>

              {formData.certifications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('certifications', index)}
                  className="btn-remove"
                >
                  ✕ Remove
                </button>
              )}
            </div>
          ))}
        </section>

        {/* LANGUAGES */}
        <section className="form-section">
          <div className="section-header">
            <h3>🌐 Languages</h3>
            <button 
              type="button"
              onClick={() => addArrayItem('languages')}
              className="btn-add"
            >
              + Add Language
            </button>
          </div>

          <div className="form-group full-width">
            {formData.languages.map((language, index) => (
              <div key={index} className="language-item">
                <input
                  type="text"
                  value={language}
                  onChange={(e) => handleArrayStringChange('languages', index, e.target.value)}
                  placeholder="Language name"
                />
                {formData.languages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('languages', index)}
                    className="btn-remove-inline"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ACHIEVEMENTS */}
        <section className="form-section">
          <div className="section-header">
            <h3>⭐ Achievements</h3>
            <button 
              type="button"
              onClick={() => addArrayItem('achievements')}
              className="btn-add"
            >
              + Add Achievement
            </button>
          </div>

          <div className="form-group full-width">
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <textarea
                  value={achievement}
                  onChange={(e) => handleArrayStringChange('achievements', index, e.target.value)}
                  placeholder="Describe your achievement"
                  rows="2"
                />
                {formData.achievements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('achievements', index)}
                    className="btn-remove"
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ACTION BUTTONS */}
        <div className="action-buttons">
          <button 
            type="button"
            onClick={onBack}
            className="btn btn-back"
            disabled={loading}
          >
            ← Back
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '⏳ Processing...' : 'Continue to AI Resume Builder →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCredentials;
