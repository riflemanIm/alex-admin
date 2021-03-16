// const hostApi =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost"
//     : "http://10.1.0.182";
const hostApi = process.env.REACT_APP_HOST_API;
//const portApi = process.env.NODE_ENV === "development" ? 8000 : 8888;
const portApi = process.env.REACT_APP_PORT_API;
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
    email: "support",
    password: "",
  },
};
