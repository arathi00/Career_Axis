import React from 'react';
import '../../pages/Student/Resume/Resume.css';

const ResumeTemplates = ({ onSelectTemplate }) => {
  const templates = [
    {
      id: 1,
      title: "Without Photo",
      description: "Recommended for most ATS systems. Clean, professional layout optimized for automated screening.",
      features: [
        "ATS-friendly formatting",
        "Clean professional layout",
        "Optimized for automated screening",
        "Standard fonts and structure"
      ],
      recommended: true
    },
    {
      id: 2,
      title: "With Photo",
      description: "Best for creative or international roles. Professional design with space for your photo.",
      features: [
        "Photo section included",
        "Creative layout options",
        "International standard compliant",
        "Professional appearance"
      ]
    }
  ];

  return (
    <div className="template-selection">
      <div className="selection-title">
        <h2>Pick a CV Template</h2>
        <p>Choose an ATS-friendly resume layout to get started</p>
      </div>
      
      <div className="templates-grid">
        {templates.map((template) => (
          <div key={template.id} className="template-card">
            {template.recommended && <div className="template-badge">Recommended</div>}
            <h3>{template.title}</h3>
            <p>{template.description}</p>
            <ul className="template-features">
              {template.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button 
              className="select-btn"
              onClick={() => onSelectTemplate(template.id)}
            >
              Select {template.title} Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeTemplates;