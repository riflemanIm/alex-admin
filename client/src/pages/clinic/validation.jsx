export default function validate(values) {
  let errors = {};
  if (!values.code) {
    errors.code = "Заполните Код";
  }
  if (!values.title) {
    errors.title = "Заполните Название";
  }
  if (!values.postal_address) {
    errors.postal_address = "Заполните Почтовый адрес";
  }
  if (!values.phone) {
    errors.phone = "Заполните Телефон";
  }
  if (!values.latitude) {
    errors.latitude = "Заполните Latitude";
  }
  if (!values.longitude) {
    errors.longitude = "Заполните Longitude";
  }

  console.log("errors", errors);
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
