export default function validate(values) {
  let errors = {};
  if (values.username==null || values.username==='') {
    errors.label = "username is empty";
  }

  return errors;
}
