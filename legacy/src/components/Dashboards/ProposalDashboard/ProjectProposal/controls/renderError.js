import React from 'react'

export const renderError = (touched, error) => {
  if (touched && error && error.length > 0) {
    return (
      <div className="alert alert-warning mt-2">
        <div className="font-small">
          { error.map((e, i) => { return (<li key={i}>{e}</li>) }) }
        </div>
      </div>
    );
  }
}