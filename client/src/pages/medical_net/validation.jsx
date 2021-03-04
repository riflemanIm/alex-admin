export default function validate(values) {
  let errors = {};
  if (!values.title) {
    errors.title = "Название";
  }
  if (!values.code) {
    errors.code = "Адрес";
  }

  return errors;
}
