import React from 'react';
import '../../styles/login.css';

const Input = ({ label, type = 'text', value, onChange, required }) => {
  return (
    <div className="input-group">
      <input
        type={type}
        className="input"
        placeholder={label}
        value={value}
        onChange={onChange}
        required={required}
      />
      <label>{label}</label>
    </div>
  );
};

export default Input;
