import React from 'react';

const renderError = ({ error, touched }) => {
  if (touched && error && error.length > 0) {
    return (
      <div className="alert alert-warning mt-2">
        <div className="font-small">
          {error.map((e, i) => {
            return <li key={i}>{e}</li>;
          })}
        </div>
      </div>
    );
  }
};

export const renderField = ({ input, label, type, placeholder, meta }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        {...input}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        className="form-control"
      ></input>
      {renderError(meta)}
    </div>
  );
};
