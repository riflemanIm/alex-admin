export default function validate(values) {
  let errors = {};
  if (values.expiryDate==null) {
    errors.label = "expiryDate is empty";
  }

  return errors;
}
