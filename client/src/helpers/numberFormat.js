const locale = (lang) => {
  switch (lang) {
    case "en":
      return "en-US";
    case "fr":
      return "fr-FR";
    default:
      return "ru-RU";
  }
};

export const numFomated = (number, lang) => number.toLocaleString(locale(lang));

export const currencyFomated = (number, lang, currency = "RUB") =>
  number.toLocaleString(locale(lang), { style: "currency", currency });
