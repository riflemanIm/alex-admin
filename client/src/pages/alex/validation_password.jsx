export default function validate(values) {
  let errors = {};
  var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
  //var mediumRegex = new RegExp("^(?=.{10,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");

  if (values.password==null || values.password==='') {
    errors.password = "password is empty";
  } else if (!strongRegex.test(values.password)) {
    errors.password = "wrong password";
  }
  return errors;
}

/*

  Пояснение:
  ^	The password string will start this way.
(?=.*[a-z])	The string must contain at least 1 lowercase alphabetical character.
(?=.*[A-Z])	The string must contain at least 1 uppercase alphabetical character.
(?=.*[0-9])	The string must contain at least 1 numeric character.
(?=.*[!@#\$%\^&\*])	The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict.
(?=.{8,})	The string must be eight characters or longer.
  */
