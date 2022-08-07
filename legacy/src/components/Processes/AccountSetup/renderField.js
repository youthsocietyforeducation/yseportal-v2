import React from 'react';

const renderField = ({ input, label, type, meta: { touched, error } }) => {
  return (
    <div>
      <label>{label}</label>
      <div className="mb-4">
        <input className="form form-control" {...input} type={type} />
        {touched && error && <span className="text-danger">{error}</span>}
      </div>
    </div>
  );
};

export default renderField;
