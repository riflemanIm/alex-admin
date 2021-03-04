export default function validate(values) {
  let errors = {};
  if (!values.username) {
    errors.username = "Заполните Username";
  }
  if (!values.first_name) {
    errors.first_name = "Заполните Имя";
  }
  if (!values.last_name) {
    errors.last_name = "Заполните Фамилие";
  }
  if (!values.phone) {
    errors.phone = "Заполните Телефон";
  }
  if (!values.notify_email) {
    errors.notify_email = "Заполните Email";
  }
  if (!/\S+@\S+\.\S+/.test(values.notify_email)) {
    errors.notify_email = "Неверный Email";
  }

  // if (!values?.password) {
  //   errors.password = "Заполните пароль";
  // }

  // if (
  //   !/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{7,}/g.test(values.password)
  // ) {
  //   errors.password = "Неверный пароль";
  // }

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
