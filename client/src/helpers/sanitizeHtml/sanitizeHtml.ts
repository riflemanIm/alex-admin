/* @flow */

import { encode, decode } from "./he";

const tagRe = /<([/])?([\S]+?)((?:\s+[^\s=>/]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s/]+))?)*?)\s*(\/?)\s*>/gim;
const tagComments = /<!--[\s\S]*?-->/gim;

var rattrs = /([^\s=]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/gim;

const cleanAttributeName = (name: string) => {
  // attribute can have any non tab, form-feed name, but we
  // use more strict check it can be \w:-
  var re = /[^\w\d:-]+/gim;
  return name.replace(re, "").toLowerCase();
};

export interface Options {
  tagsBlacklist: ReadonlyArray<string | ((string: string) => boolean)>;
  attrsBlacklist: ReadonlyArray<string | ((string: string) => boolean)>;
  attrsWithScheme: ReadonlyArray<string | ((string: string) => boolean)>;
  allowedSchemes: ReadonlyArray<string | ((string: string) => boolean)>;
  selfClosingTags: ReadonlyArray<string | ((string: string) => boolean)>;
}

const defaultOptions = {
  tagsBlacklist: [
    "script",
    "style",
    "iframe",
    "object",
    "meta",
    (tagName: string) => {
      const reTag = /^[a-zA-Z]+\w*$/i;
      return !reTag.test(tagName);
    },
  ],

  attrsBlacklist: [
    "poster",
    "repeat",
    "pattern",
    "srcset",
    (attrName: string) => attrName.startsWith("on"),
  ],

  attrsWithScheme: ["formaction", "href", "xlink:href"],
  allowedSchemes: [
    "http",
    "https",
    "mailto",
    "tel",
    (attrValue: string) => !attrValue.includes(":"),
  ],
  selfClosingTags: ["br"],
};

const isSchemaAllowed = (
  value: string,
  allowedSchemes: ReadonlyArray<string | ((string: string) => boolean)>
): boolean =>
  allowedSchemes.some((schemePrefixOrTestFn) => {
    if (typeof schemePrefixOrTestFn === "string") {
      return value.startsWith(`${schemePrefixOrTestFn}:`);
    }
    return schemePrefixOrTestFn(value);
  });

const isListHasItem = (
  name: string,
  list: ReadonlyArray<string | ((string: string) => boolean)>
) =>
  list.some((itemNameOrTestFn) => {
    if (typeof itemNameOrTestFn === "string") {
      return itemNameOrTestFn === name;
    }
    return itemNameOrTestFn(name);
  });

export const sanitizeHtmlWithErrors = (
  str: string,
  argOptions?: Options
): {
  errors: ReadonlyArray<string>;
  value: string;
} => {
  let errors: any[] = [];
  const stack: any[] = [];
  const options = {
    ...defaultOptions,
    ...argOptions,
  };

  const replaceTag = (
    match: string,
    closeSym: string,
    tagName: string,
    attrs: string,
    selfCloseSym: string
  ) => {
    if (isListHasItem(tagName, options.tagsBlacklist)) {
      return "";
    }

    if (closeSym === "/") {
      // fix html if closed tags don't match
      const idx = stack.lastIndexOf(tagName);
      let r = "";
      if (idx > -1) {
        for (let i = stack.length - 1; i >= idx; --i) {
          r += `</${stack[i]}>`;
          stack.pop();
        }
        return r;
      }

      return "";
    }

    rattrs.lastIndex = 0;

    let result: RegExpExecArray | null;
    let attrsArr = [];
    while ((result = rattrs.exec(attrs))) {
      const [
        ,
        attrName,
        attrQuoteValue,
        attrSingleQuoteValue,
        attrNoQuoteValue,
      ] = result;

      if (attrName == null) continue;

      const cleanName = cleanAttributeName(attrName);

      if (isListHasItem(attrName, options.attrsBlacklist)) {
        continue;
      }

      if (cleanName === "") continue;

      const { decoded, errors: errorsDec } = decode(
        attrQuoteValue || attrSingleQuoteValue || attrNoQuoteValue || ""
      );

      const { encoded, errors: errorsEnc } = encode(decoded);

      errors = errors.concat(errorsDec, errorsEnc);

      if (
        isListHasItem(attrName, options.attrsWithScheme) &&
        !isSchemaAllowed(encoded, options.allowedSchemes)
      ) {
        continue;
      }

      attrsArr.push(encoded ? `${cleanName}="${encoded}"` : `${cleanName}`);
    }

    if (
      selfCloseSym !== "/" &&
      options.selfClosingTags.every((v) => v !== tagName.toLowerCase())
    ) {
      stack.push(tagName);
    }

    const newAttrs = attrsArr.join(" ");
    return newAttrs === ""
      ? selfCloseSym === "/" &&
        options.selfClosingTags.some((v) => v === tagName.toLowerCase())
        ? `<${tagName}/>`
        : `<${tagName}>${selfCloseSym === "/" ? `</${tagName}>` : ""}`
      : `<${tagName} ${newAttrs}>${
          selfCloseSym === "/" ? `</${tagName}>` : ""
        }`;
  };

  let r = str.replace(tagComments, "").replace(tagRe, replaceTag);
  for (let i = stack.length - 1; i > -1; --i) {
    r += `</${stack[i]}>`;
  }

  return {
    errors,
    value: r,
  };
};

export const sanitizeHtml = (str: string, argOptions?: Options): string => {
  const { value } = sanitizeHtmlWithErrors(str, argOptions);
  return value;
};
