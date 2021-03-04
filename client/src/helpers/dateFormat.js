import { parse, format, isValid } from "date-fns";
import ruLocale from "date-fns/locale/ru";
import enLocale from "date-fns/locale/en-US";
import frLocale from "date-fns/locale/fr";

import buildLocalizeFn from "date-fns/locale/_lib/buildLocalizeFn";
//import moment from "moment/moment";
//const { lang } = user != null ? JSON.parse(user) : { lang: "ru" };
//console.log("lang", lang);
export const Locales = { en: enLocale, fr: frLocale, ru: ruLocale };

const HL7_FORMAT = "yyyyMMdd";
const monthValues = {
  en: {
    narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    abbreviated: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    wide: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  fr: {
    narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    abbreviated: [
      "janv.",
      "févr.",
      "mars",
      "avr.",
      "mai",
      "juin",
      "juil.",
      "août",
      "sept.",
      "oct.",
      "nov.",
      "déc.",
    ],
    wide: [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ],
  },
  ru: {
    narrow: ["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"],
    abbreviated: [
      "янв.",
      "фев.",
      "март",
      "апр.",
      "май",
      "июнь",
      "июль",
      "авг.",
      "сент.",
      "окт.",
      "нояб.",
      "дек.",
    ],
    wide: [
      "январь",
      "февраль",
      "март",
      "апрель",
      "май",
      "июнь",
      "июль",
      "август",
      "сентябрь",
      "октябрь",
      "ноябрь",
      "декабрь",
    ],
  },
};
export const parseHL7Date = (date) => {
  const parsed = parse(date, "yyyyMMddhhmmss", Date.now());
  if (!isValid(parsed)) {
    return null;
  }
  return parsed;
};
export const convertToISODate = (hl7Date) => {
  // this function will return an ISO formatted date string in UTC from the insanity that is hl7 dates
  // the function is now more sane

  var utcDate = new Date();
  utcDate.setFullYear(
    hl7Date.substring(0, 4),
    hl7Date.substring(4, 6) - 1,
    hl7Date.substring(6, 8)
  );
  utcDate.setHours(hl7Date.substring(8, 10), hl7Date.substring(10, 12), "00");
  return utcDate.toISOString();
};

export const formatStrDateToHL7 = (date) => {
  return format(new Date(date), HL7_FORMAT);
};
export const formatDateToHL7 = (date) => {
  if (isValid(date)) return format(date, HL7_FORMAT);
};
export const formatHL7DateToTime = (HL7_DATE) => {
  return format(new Date(convertToISODate(HL7_DATE)), "HH:mm");
};
export const formatHL7DateToSrtDate = (
  HL7_DATE,
  lang = "ru",
  FORMAT = "dd MMMM",
  isSingular = false
) =>
  format(new Date(convertToISODate(HL7_DATE)), FORMAT, {
    locale: isSingular
      ? {
          ...Locales[lang],
          localize: {
            ...Locales[lang].localize,
            month: buildLocalizeFn({
              values: monthValues[lang],
              defaultWidth: "wide",
              defaultFormattingWidth: "wide",
            }),
          },
        }
      : Locales[lang],
  });
export const formatDate = (
  date,
  lang = "ru",
  FORMAT = "dd MMM yyyy",
  isSingular = false
) =>
  format(date, FORMAT, {
    locale: isSingular
      ? {
          ...Locales[lang],
          localize: {
            ...Locales[lang].localize,
            month: buildLocalizeFn({
              values: monthValues[lang],
              defaultWidth: "wide",
              defaultFormattingWidth: "wide",
            }),
          },
        }
      : Locales[lang],
  });
