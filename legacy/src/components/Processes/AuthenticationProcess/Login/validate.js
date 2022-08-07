/**
 * this is the validate function for LoginComponent
 * @param {*} vals
 */

export const validate = (vals) => {
  const errors = {};
  if (!vals.email) {
    errors.email = "Email can't be empty";
  }
  if (!vals.password) {
    errors.password = "Password can't be empty";
  }
  return errors;
};
