export default function validate(values) {
  let errors = {};
  if (!values.action_text) {
    errors.action_text = "Заполните промо";
  }
  if (!values.description) {
    errors.description = "Заполните описание";
  }
  if (!values.sort_order) {
    errors.sort_order = "Заполните сортировку";
  }
  if (!values.date_from) {
    errors.date_from = "Заполните начало акции";
  }
  if (!values.date_to) {
    errors.date_to = "Заполните конец акции";
  }

  if (!values.url) {
    errors.url = "Заполните URL";
  }

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
