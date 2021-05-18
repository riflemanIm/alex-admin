export default function validate(values) {
  let errors = {};
  if (values.password==null || values.password==='') {
    errors.password = "password is empty";
  } else if (!/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{7,}/g.test(values.password)) {
    errors.password = "wrong password";
  }
  return errors;
}

/*
  /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{7,}/g
  Пояснение:
  (?=.*[0-9]) - строка содержит хотя бы одно число;
  (?=.*[a-z]) - строка содержит хотя бы одну латинскую букву в нижнем регистре;
  (?=.*[A-Z]) - строка содержит хотя бы одну латинскую букву в верхнем регистре;
  [0-9a-zA-Z]{7,} - строка состоит не менее, чем из 7 вышеупомянутых символов.
  */
