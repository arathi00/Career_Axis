import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import '../../pages/Student/Resume/Resume.css';

const ResumePreview = ({ resumeData, templateType, onBack }) => {
  const resumeRef = useRef();

  const downloadPDF = async () => {
    const element = resumeRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
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
    pdf.save(`${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`);
  };

  return (
    <div className="resume-preview-container">
      <div className="section-header">
        <h2>Resume Preview</h2>
        <p>ATS-Friendly Format - Ready to Download</p>
      </div>

      <div ref={resumeRef} className="resume-document">
        <style>
          {`
            .resume-document {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              background: white;
              padding: 20mm;
              font-family: 'Segoe UI', 'Calibri', Arial, sans-serif;
              color: #000;
              box-shadow: 0 5px 20px rgba(0,0,0,0.1);
              line-height: 1.4;
              font-size: 11pt;
            }
            
            .resume-header {
              display: ${templateType === 2 ? 'flex' : 'block'};
              justify-content: space-between;
              align-items: ${templateType === 2 ? 'center' : 'flex-start'};
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 2px solid #000;
            }
            
            .header-left {
              flex: 1;
            }
            
            .resume-photo {
              width: 35mm;
              height: 45mm;
              object-fit: cover;
              border: 1px solid #000;
            }
            
            .name {
              font-size: 24pt;
              font-weight: 700;
              margin-bottom: 5px;
              color: #000;
              letter-spacing: -0.5px;
            }
            
            .contact-info {
              font-size: 10pt;
              color: #333;
              margin-bottom: 5px;
            }
            
            .section-title {
              font-size: 14pt;
              font-weight: 700;
              margin: 15px 0 10px 0;
              padding-bottom: 5px;
              border-bottom: 1px solid #000;
              color: #000;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .education-item, .project-item, .certification-item {
              margin-bottom: 12px;
              page-break-inside: avoid;
            }
            
            .item-header {
              display: flex;
              justify-content: space-between;
              font-weight: 600;
              margin-bottom: 3px;
            }
            
            .item-details {
              font-size: 10pt;
              color: #333;
              margin-bottom: 3px;
            }
            
            .item-description {
              font-size: 10pt;
              margin-left: 15px;
            }
            
            .skills-list {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 5px;
              font-size: 10pt;
            }
            
            .skill-item {
              margin-bottom: 3px;
            }
            
            .summary {
              font-size: 10.5pt;
              line-height: 1.5;
              margin-bottom: 15px;
              text-align: justify;
            }
            
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            @media print {
              .resume-document {
                box-shadow: none;
                margin: 0;
                padding: 20mm;
              }
            }
          `}
        </style>

        <div className="resume-header">
          <div className="header-left">
            <div className="name">{resumeData.name || 'Your Name'}</div>
            <div className="contact-info">
              {resumeData.email} | {resumeData.phone} | {resumeData.location}
            </div>
            {(resumeData.linkedin || resumeData.github) && (
              <div className="contact-info">
                {resumeData.linkedin && `LinkedIn: ${resumeData.linkedin}`}
                {resumeData.linkedin && resumeData.github && ' | '}
                {resumeData.github && `GitHub: ${resumeData.github}`}
              </div>
            )}
          </div>
          {templateType === 2 && resumeData.photo && (
            <img src={resumeData.photo} alt="Profile" className="resume-photo" />
          )}
        </div>

        {resumeData.summary && (
          <>
            <div className="section-title">Professional Summary</div>
            <div className="summary">{resumeData.summary}</div>
          </>
        )}

        {resumeData.education.length > 0 && (
          <>
            <div className="section-title">Education</div>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="item-header">
                  <span>{edu.school}</span>
                  <span>{edu.year}</span>
                </div>
                <div className="item-details">
                  {edu.branch} | CGPA/Percentage: {edu.cgpa}
                </div>
              </div>
            ))}
          </>
        )}

        {resumeData.projects.length > 0 && (
          <>
            <div className="section-title">Projects</div>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="project-item">
                <div className="item-header">
                  <span>{project.title}</span>
                  <span>{project.technologies}</span>
                </div>
                <div className="item-description">
                  {project.description.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                {project.github && (
                  <div className="item-details">GitHub: {project.github}</div>
                )}
              </div>
            ))}
          </>
        )}

        {resumeData.certifications.length > 0 && (
          <>
            <div className="section-title">Certifications</div>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="certification-item">
                <div className="item-header">
                  <span>{cert.name}</span>
                  <span>{cert.year}</span>
                </div>
                <div className="item-details">{cert.organization}</div>
              </div>
            ))}
          </>
        )}

        {resumeData.skills && (
          <>
            <div className="section-title">Technical Skills</div>
            <div className="skills-list">
              {resumeData.skills.split(',').map((skill, index) => (
                <div key={index} className="skill-item">• {skill.trim()}</div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="preview-actions">
        <button className="back-btn" onClick={onBack}>
          Back to Editing
        </button>
        <button className="download-btn" onClick={downloadPDF}>
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default ResumePreview;