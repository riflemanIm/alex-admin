export default function sortObject(o) {
  const sorted = {};
  const a = [];

  for (const key in o) {
    if (Object.prototype.hasOwnProperty.call(o, key)) {
      a.push(key);
    }
  }

  a.sort();

  for (let key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
}
