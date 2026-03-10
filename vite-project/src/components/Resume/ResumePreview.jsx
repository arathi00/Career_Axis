import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import '../../pages/Student/Resume/Resume.css';

const ResumePreview = ({ resumeData, templateType, onBack }) => {
  const resumeRef = useRef();

  // Format phone number
  const formatPhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\d{10})/, '$1') || phone;
  };

  // Filter empty items
  const hasEducation = resumeData.education && resumeData.education.some(e => e.school);
  const hasProjects = resumeData.projects && resumeData.projects.some(p => p.title);
  const hasCertifications = resumeData.certifications && resumeData.certifications.some(c => c.name);
  const hasAchievements = resumeData.achievements && resumeData.achievements.length > 0;
  const hasLanguages = resumeData.languages && resumeData.languages.length > 0;

  const downloadPDF = async () => {
    const element = resumeRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`${(resumeData.name || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`);
  };

  return (
    <div className="resume-preview-container">
      <div className="section-header">
        <h2>Professional Resume Preview</h2>
        <p>ATS-Optimized Format - Ready to Download</p>
      </div>

      <div ref={resumeRef} className="resume-document professional-resume">
        <style>
          {`
            .professional-resume {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              background: white;
              padding: 15mm 18mm;
              font-family: 'Calibri', 'Cambria', sans-serif;
              color: #1a1a1a;
              box-shadow: 0 5px 25px rgba(0,0,0,0.15);
              line-height: 1.3;
              font-size: 10.5pt;
            }

            /* Header Section */
            .resume-header-section {
              text-align: center;
              margin-bottom: 10pt;
              padding-bottom: 8pt;
              border-bottom: 2.5pt solid #2c3e50;
            }

            .resume-full-name {
              font-size: 26pt;
              font-weight: 700;
              color: #1a1a1a;
              margin: 0 0 3pt 0;
              letter-spacing: -0.5px;
              font-family: 'Calibri', sans-serif;
            }

            .resume-contact-line {
              font-size: 9.5pt;
              color: #404040;
              margin: 2pt 0;
              letter-spacing: 0.3px;
            }

            .contact-divider {
              margin: 0 5pt;
              color: #666;
            }

            /* Section Styling */
            .resume-section {
              margin-bottom: 12pt;
              page-break-inside: avoid;
            }

            .resume-section-title {
              font-size: 12pt;
              font-weight: 700;
              color: #1a1a1a;
              text-transform: uppercase;
              border-bottom: 1.5pt solid #2c3e50;
              padding-bottom: 4pt;
              margin-bottom: 8pt;
              letter-spacing: 1px;
              font-family: 'Calibri', sans-serif;
            }

            .summary-text {
              font-size: 10.5pt;
              line-height: 1.35;
              color: #1a1a1a;
              text-align: justify;
              margin-bottom: 10pt;
            }

            /* Entry Styling */
            .resume-entry {
              margin-bottom: 10pt;
              page-break-inside: avoid;
            }

            .entry-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2pt;
            }

            .entry-title {
              font-weight: 700;
              font-size: 10.5pt;
              color: #1a1a1a;
            }

            .entry-date {
              font-weight: 600;
              font-size: 9.5pt;
              color: #555;
            }

            .entry-subtitle {
              font-style: italic;
              font-size: 10pt;
              color: #2c3e50;
              margin-bottom: 3pt;
            }

            .entry-details {
              font-size: 10pt;
              color: #333;
              margin-bottom: 2pt;
            }

            .entry-description {
              font-size: 10pt;
              line-height: 1.3;
              color: #1a1a1a;
              margin-left: 12pt;
              margin-bottom: 5pt;
            }

            .bullet-point {
              margin-bottom: 3pt;
            }

            /* Skills Section */
            .skills-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8pt;
              font-size: 10pt;
            }

            .skill-category {
              margin-bottom: 6pt;
            }

            .skill-category-name {
              font-weight: 600;
              color: #2c3e50;
              font-size: 9.5pt;
              margin-bottom: 2pt;
            }

            .skill-items {
              display: flex;
              flex-wrap: wrap;
              gap: 4pt;
            }

            .skill-badge {
              display: inline-block;
              background: #f5f5f5;
              padding: 2pt 5pt;
              border-radius: 2pt;
              font-size: 9.5pt;
              color: #333;
              border-left: 2pt solid #2c3e50;
            }

            /* Achievement/Certification styling */
            .achievement-item {
              font-size: 10pt;
              color: #1a1a1a;
              margin-bottom: 4pt;
              line-height: 1.3;
            }

            .achievement-bullet {
              margin-left: 10pt;
              margin-bottom: 3pt;
            }

            /* Languages */
            .language-item {
              display: inline-block;
              margin-right: 15pt;
              font-size: 10pt;
              color: #333;
              margin-bottom: 2pt;
            }

            /* Highlighting important text */
            .highlight {
              font-weight: 600;
              color: #2c3e50;
            }

            /* Print optimization */
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            @media print {
              .professional-resume {
                box-shadow: none;
                margin: 0;
                padding: 15mm 18mm;
              }
            }
          `}
        </style>

        {/* Header */}
        <div className="resume-header-section">
          <div className="resume-full-name">
            {(resumeData.name || 'Your Name').toUpperCase()}
          </div>
          <div className="resume-contact-line">
            {resumeData.email && <span>{resumeData.email}</span>}
            {resumeData.email && resumeData.phone && <span className="contact-divider">•</span>}
            {resumeData.phone && <span>{formatPhone(resumeData.phone)}</span>}
            {(resumeData.email || resumeData.phone) && resumeData.location && <span className="contact-divider">•</span>}
            {resumeData.location && <span>{resumeData.location}</span>}
          </div>
          {(resumeData.linkedin || resumeData.github) && (
            <div className="resume-contact-line">
              {resumeData.linkedin && <span>LinkedIn: {resumeData.linkedin}</span>}
              {resumeData.linkedin && resumeData.github && <span className="contact-divider">•</span>}
              {resumeData.github && <span>GitHub: {resumeData.github}</span>}
            </div>
          )}
        </div>

        {/* Professional Summary */}
        {resumeData.summary && resumeData.summary.trim() && (
          <div className="resume-section">
            <div className="resume-section-title">Professional Summary</div>
            <div className="summary-text">
              {resumeData.summary}
            </div>
          </div>
        )}

        {/* Career Objective */}
        {resumeData.job_objective && resumeData.job_objective.trim() && (
          <div className="resume-section">
            <div className="resume-section-title">Career Objective</div>
            <div className="summary-text">
              Seeking a <strong>{resumeData.job_objective}</strong> position to leverage my technical expertise and contribute to organizational growth.
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {(resumeData.technical_skills?.length > 0 || resumeData.skills) && (
          <div className="resume-section">
            <div className="resume-section-title">Technical Skills</div>
            <div className="skills-grid">
              {resumeData.technical_skills && resumeData.technical_skills.length > 0 ? (
                <div className="skill-items">
                  {resumeData.technical_skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : resumeData.skills ? (
                <div className="skill-items">
                  {resumeData.skills.split(',').map((skill, idx) => (
                    <span key={idx} className="skill-badge">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Internships/Experience - Moved to appear before Projects */}
        {resumeData.internships?.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">Experience & Internships</div>
            {resumeData.internships.map((internship, index) => (
              internship.title ? (
                <div key={index} className="resume-entry">
                  <div className="entry-header">
                    <span className="entry-title">{internship.title}</span>
                    {internship.duration && <span className="entry-date">{internship.duration}</span>}
                  </div>
                  {internship.company && (
                    <div className="entry-subtitle">{internship.company}</div>
                  )}
                  {internship.description && (
                    <div className="entry-description">
                      {internship.description.split('\n').map((line, i) => (
                        line.trim() && (
                          <div key={i} className="bullet-point">
                            • {line.trim()}
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ) : null
            ))}
          </div>
        )}

        {/* Projects */}
        {hasProjects && (
          <div className="resume-section">
            <div className="resume-section-title">Projects</div>
            {resumeData.projects.map((project, index) => (
              project.title && (
                <div key={index} className="resume-entry">
                  <div className="entry-header">
                    <span className="entry-title">{project.title}</span>
                  </div>
                  {project.technologies && (
                    <div className="entry-subtitle">
                      <span className="highlight">Tech Stack:</span> {project.technologies}
                    </div>
                  )}
                  {project.description && (
                    <div className="entry-description">
                      {project.description.split('\n').map((line, i) => (
                        line.trim() && (
                          <div key={i} className="bullet-point">
                            • {line.trim()}
                          </div>
                        )
                      ))}
                    </div>
                  )}
                  {project.github && (
                    <div className="entry-details">
                      <span className="highlight">Repository:</span> {project.github}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        )}

        {/* Education */}
        {hasEducation && (
          <div className="resume-section">
            <div className="resume-section-title">Education</div>
            {resumeData.education.map((edu, index) => (
              edu.school && (
                <div key={index} className="resume-entry">
                  <div className="entry-header">
                    <span className="entry-title">{edu.school}</span>
                    <span className="entry-date">{edu.year || ''}</span>
                  </div>
                  <div className="entry-subtitle">
                    {edu.branch && edu.cgpa ? (
                      <span>{edu.branch} • CGPA: {edu.cgpa}</span>
                    ) : edu.branch ? (
                      <span>{edu.branch}</span>
                    ) : edu.cgpa ? (
                      <span>CGPA: {edu.cgpa}</span>
                    ) : null}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Certifications */}
        {hasCertifications && (
          <div className="resume-section">
            <div className="resume-section-title">Certifications & Awards</div>
            {resumeData.certifications.map((cert, index) => (
              cert.name && (
                <div key={index} className="resume-entry">
                  <div className="entry-header">
                    <span className="entry-title">{cert.name}</span>
                    <span className="entry-date">{cert.year || ''}</span>
                  </div>
                  {cert.organization && (
                    <div className="entry-subtitle">{cert.organization}</div>
                  )}
                </div>
              )
            ))}
          </div>
        )}

        {/* Achievements */}
        {hasAchievements && (
          <div className="resume-section">
            <div className="resume-section-title">Key Achievements</div>
            {resumeData.achievements.map((achievement, index) => (
              achievement && (
                <div key={index} className="achievement-item">
                  <div className="achievement-bullet">• {achievement}</div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Languages */}
        {hasLanguages && (
          <div className="resume-section">
            <div className="resume-section-title">Languages</div>
            <div>
              {resumeData.languages.map((lang, index) => (
                <span key={index} className="language-item">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="preview-actions">
        <button className="back-btn" onClick={onBack}>
          ← Back to Editing
        </button>
        <button className="download-btn" onClick={downloadPDF}>
          ⬇ Download as PDF
        </button>
      </div>
    </div>
  );
};

export default ResumePreview;