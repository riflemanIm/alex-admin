export default function validate(values) {
  let errors = {};
  if (!values.label) {
    errors.label = "Название(Label)";
  }
  if (!values.address) {
    errors.address = "Адрес";
  }
  if (!values.file_server_address) {
    errors.file_server_address = "Адрес сервера";
  }
  if (!values.file_server_binding_name) {
    errors.file_server_binding_name = "Имя сборки";
  }

  return errors;
}
