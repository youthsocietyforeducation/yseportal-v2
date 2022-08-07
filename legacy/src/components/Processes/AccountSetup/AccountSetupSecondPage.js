// import React from 'react';
// import { Field, reduxForm } from 'redux-form';
// import FieldImageInput from '../../../../FieldImageInput';
// import validate from './validate';
// import { Button } from 'react-bootstrap';
// const AccountSetupSecondPage = (props) => {
//   const { handleSubmit, previousPage } = props;
//   console.log('AccountSetupSecondPage: ', props);

//   return (
//     <form onSubmit={handleSubmit}>
//       <Field name="profileImage" component={renderField} />
//       <div className="d-flex justify-content-end mt-4">
//         <Button variant="outline-primary" onClick={previousPage}>
//           Previous
//         </Button>
//         <Button type="submit" variant="primary">
//           Next
//         </Button>
//       </div>
//     </form>
//   );
// };
// const renderField = ({ input }) => {
//   console.log('renderField: ', input);
//   return (
//     <FieldImageInput
//       name="profileImage"
//       className="form-control-file"
//       type="file"
//       {...input}
//       label="Upload an Image!"
//       accept="image/png, image/jpeg, .jpg"
//     />
//   );
// };
// export default reduxForm({
//   form: 'accountSetup',
//   destroyOnUnmount: false,
//   forceUnregisterOnUnmount: true,
//   validate,
// })(AccountSetupSecondPage);
