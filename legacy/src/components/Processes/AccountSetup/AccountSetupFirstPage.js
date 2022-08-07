import React from 'react';
import { Field, reduxForm } from 'redux-form';
import validate from './validate';
import renderField from './renderField';
import { Button } from 'react-bootstrap';
const AccountSetupFirstPage = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="firstName"
        type="text"
        component={renderField}
        label="First Name"
      />

      <Field
        name="lastName"
        type="text"
        component={renderField}
        label="Last Name"
      />

      <Field
        name="phoneNumber"
        type="tel"
        component={renderField}
        label="Phone Number"
      />

      <div>
        <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit">
            Next
          </Button>
        </div>
      </div>
    </form>
  );
};
export default reduxForm({
  form: 'accountSetup',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(AccountSetupFirstPage);
