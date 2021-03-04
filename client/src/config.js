const hostApi =
  process.env.NODE_ENV === "development"
    ? "http://localhost"
    : "http://10.1.0.182";
const portApi = process.env.NODE_ENV === "development" ? 8000 : 8080;
const baseURLApi = `${hostApi}${portApi ? `:${portApi}` : ``}/api`;
const baseURLimages = `${hostApi}${portApi ? `:${portApi}` : ``}/images`;
console.log("portApi", portApi);
const redirectUrl = baseURLApi;
const pNames = ["mobimed_site", "mobi_app", "telemedialog", "telemed", "test"];

export default {
  pNames,
  hostApi,
  portApi,
  baseURLApi,
  baseURLimages,
  redirectUrl,
  remote: "https://sing-generator-node.herokuapp.com",
  isBackend: true,
  auth: {
    email: "admin",
    password: "Ar40tqVA",
  },
};
