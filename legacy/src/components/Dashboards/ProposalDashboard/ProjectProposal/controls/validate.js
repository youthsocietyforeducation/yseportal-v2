/* simple empty check */
const validate = (val) => {
  console.log('validate ppf', val);
  const err = {};
  err.title = [];
  err.description = [];
  err.branch = [];
  err.department = [];
  err.authors = [];
  err.files = [];

  if (!val.title) {
    err.title = [...err.title, 'Title should not be empty'];
  }

  if (!val.description) {
    err.description = [...err.description, 'Description should not be empty'];
  }

  if (!val.branch) {
    err.branch = [...err.branch, 'Branch should not be empty'];
  }

  if (!val.department) {
    err.department = [...err.department, 'Department should not be empty'];
  }

  if (!(val.files && val.files.length > 0) && !val.isEditable) {
    err.files = [...err.files, 'Select at least 1 file'];
  }

  if (
    err.title.length < 1 &&
    err.description.length < 1 &&
    err.branch.length < 1 &&
    err.department.length < 1 &&
    err.authors.length < 1 &&
    err.files.length < 1
  ) {
    return {};
  }
  return err;
};

export default validate;
