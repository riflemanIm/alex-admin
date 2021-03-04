import merge from "lodash.merge";
import localJson from "./translations/ru.json";
import requestPromise from "request-promise";
import request from "request";
import fs from "fs";

try {
  /** ================ CHECK process.argv ================ */
  if (!["ru", "en", "fr"].includes(process.argv[2]))
    throw new Error("Needed param LANG after name script ");
  if (
    !["mobimed_site", "mobi_app", "telemedialog", "telemed", "test"].includes(
      process.argv[3]
    )
  )
    throw new Error("Needed param PROJECT_NAME after param LANG");

  /** ================ CONSTs ================ */
  const LANG = process.argv[2];
  const PROJECT_NAME = process.argv[3];
  const HOST = "http://localhost:8000";
  const url = `${HOST}/api/translations/download/${LANG}/${PROJECT_NAME}`;
  const urlUpload = `${HOST}/api/translations/import-file`;
  const distFile = `${__dirname}/translations/${LANG}.json`;

  const uploadData = async () => {
    /** ================ UPLOAD ================*/
    try {
      const req = await request.put(urlUpload, (err, resp, body) => {
        if (err) {
          console.error("Error!", err.message);
        } else {
          console.log("Result: " + body);
        }
      });
      const form = req.form();
      form.append("filedata", fs.createReadStream(distFile));
      form.append("filename", `${LANG}.json`);
      form.append("account_id", "1");
      form.append("pname", "test");
      form.append("deleteOldKeys", "false");
      form.append("doBackup", "true");
    } catch (error) {
      console.log(error.message);
    }
  };

  /** ================ CHECK Destination file ================ */
  if (!fs.existsSync(distFile)) {
    throw new Error("Destination file not exists");
  }

  /** ================ GET REMOTE JSON ================ */
  requestPromise({
    url,
    method: "GET",
    json: true,
  })
    .then((remoteJson) => {
      /** ================ MERGE LOCAL AND REMOTE ================ */
      const mergedJson = merge(remoteJson, localJson);

      /** ================ SAVE mergedJson TO LOCAL ================ */
      return new Promise(function (resolve, reject) {
        fs.writeFile(distFile, JSON.stringify(mergedJson, null, 2), (err) => {
          if (err) reject(err);
          else resolve(true);
        });
      });
    })
    .then((saved) => {
      if (saved) {
        setTimeout(uploadData, 2000);
        //uploadData();
      }
    })
    .catch((err) => console.error(err.message));
} catch (e) {
  console.log(e.message);
}
