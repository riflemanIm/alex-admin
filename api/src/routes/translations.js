import express from "express";
import db from "../models/translations-model";
//import { use } from "passport";
import multer from "multer";
import { tranformNoda, trimChar } from "../helpers/helpers";
const upload = multer();
const router = express.Router();
//const Iconv = require("iconv").Iconv;
import * as CSV from "csv-string";
// GET ALL TRANSLATION
router.get("/", async (req, res) => {
  try {
    const translations = await db.find();
    //console.log("translations", translations);
    res.status(200).json(translations);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// GET ALL BACKAPS
router.get("/backups", async (req, res) => {
  try {
    const backups = await db.findBackupsTranslations();
    //console.log("\n backups \n", backups);
    res.status(200).json(backups);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// GET TRANSLATION BY ID
router.get("/:id", async (req, res) => {
  const translationId = req.params.id;
  try {
    const translation = await db.findById(translationId);
    if (!translation) {
      res
        .status(404)
        .json({ err: "The translation with the specified id does not exist" });
    } else {
      //console.log("\n\n\n -- translation --- \n\n\n", translation);
      res.status(200).json(translation);
    }
  } catch (err) {
    res.status({ err: "The translation information could not be retrieved" });
  }
});

//GET CSV
router.get("/getcsv/:pname", async (req, res) => {
  //const lang = req.params.lang;
  const pname = req.params.pname;
  try {
    const translation = await db.findByPName(pname);
    if (!translation) {
      res
        .status(404)
        .json({ err: "The translation with the specified id does not exist" });
    } else {
      //console.log("\n\n\n -- translation --- \n\n\n", translation);
      const fields = [
        {
          label: "Группа",
          value: "gkey",
        },
        {
          label: "Ключ",
          value: "tkey",
        },
        {
          label: "Русский",
          value: "lang_ru",
        },
        {
          label: "Английский",
          value: "lang_en",
        },
        {
          label: "Французский",
          value: "lang_fr",
        },
      ];

      let arr = [fields.map((item) => item.label)];
      translation.forEach((row) => {
        arr.push(fields.map((item) => row[item.value]));
      });

      const csv = CSV.stringify(arr);

      //const iconv = new Iconv("utf8", "cp1251");
      //const iconv = require("iconv-lite");
      //let body = Buffer.from(csv);
      //const body = iconv.convert(csv).toString("cp1251");
      //const body = iconv.encode(iconv.decode(csv, "utf8"), "cp1251").toString();
      // let body = Buffer.from(csv,"ascii").toString();
      // res.set('Content-Type', 'application/json; charset=iso-8859-1');

      res.attachment("translation.csv");
      res.status(200).send(csv);
    }
  } catch (err) {
    res.status({ err: "The translation information could not be retrieved" });
  }
});

// GET TRANSLATION AS JSON
router.get("/download/:lang/:pname", async (req, res) => {
  const lang = req.params.lang;
  const pname = req.params.pname;

  try {
    const translation = await db.findByLangPName(lang, pname);
    //console.log("translation", translation);
    if (!translation) {
      res
        .status(404)
        .json({ err: "The translation with the specified id does not exist" });
    } else {
      const object = translation.reduce((obj, item) => {
        const textData =
          item[`lang_${lang}`] != null ? item[`lang_${lang}`].trim() : "";

        if (item.gkey !== "") {
          return {
            ...obj,
            [item.gkey]: {
              ...obj[item.gkey],
              [item.tkey]: textData,
            },
          };
        }
        return {
          ...obj,
          [item.tkey]: textData,
        };
      }, {});

      const objectTrans = {};
      Object.keys(object).forEach((gkey) => {
        // console.log("object", gkey, object[gkey]);
        if (typeof object[gkey] === "object") {
          objectTrans[gkey] = tranformNoda(object[gkey]);
        } else {
          objectTrans[gkey] = object[gkey];
        }

        //return { ...key[0] };
      }, {});

      //console.log("\n\n\n -- translation --- \n\n\n", objectTrans);
      res.writeHead(200, {
        "Content-Type": "application/json-my-attachment",
        "content-disposition": `attachment; filename="${lang}.json"`,
      });
      res.end(JSON.stringify(objectTrans, null, 2));
    }
  } catch (err) {
    res.status({ err: "The translation information could not be retrieved" });
  }
});

// IMORT CSV
router.put("/import-csv", upload.single("filedata"), async (req, res) => {
  try {
    if (!req.file) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "filename") to retrieve the uploaded file
      const { buffer } = req.file;
      const {
        filename,
        pname,
        account_id,

        //deleteOldKeys,
        doBackup,
      } = req.body;

      await db.backupTranslations(pname);

      //if (deleteOldKeys === "true") await db.removeTranslationsByPName(pname);

      //const translation = JSON.parse(buffer.toString("utf8"));

      // Split on row

      const rows = CSV.parse(buffer.toString("utf8"));

      const headers = rows.shift();
      rows.forEach((row) => {
        const gkey = row[0];
        const tkey = row[1];
        const data = {
          lang_ru: row[2],
          lang_en: row[3],
          lang_fr: row[4],
          checked_ru: true,
          checked_en: true,
          checked_fr: true,
          account_id: parseInt(account_id),
        };
        //console.log("\n", pname, gkey, tkey, data);
        if (pname && tkey) db.updateTranslationRow(pname, gkey, tkey, data);
      });
      res.send({ status: "ok", filename });
    }
  } catch (err) {
    console.log("\n ------- err ------\n", err);
    res
      .status(500)
      .json({ err: "Error uploading file ", message: err.message });
  }
});
// IMORT JSON
router.put("/import-json", upload.single("filedata"), async (req, res) => {
  try {
    if (!req.file) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "filename") to retrieve the uploaded file
      const { buffer } = req.file;
      const {
        filename,
        pname,
        account_id,

        deleteOldKeys,
        doBackup,
      } = req.body;

      if (doBackup === "true") await db.backupTranslations(pname);

      if (deleteOldKeys === "true") await db.removeTranslationsByPName(pname);

      const translation = JSON.parse(buffer.toString("utf8"));
      const lang = filename.split(".")[0];

      let parentTKeys = [];
      let level = 0;
      const transform = (object, gkey) => {
        for (const [tkey, obj] of Object.entries(object)) {
          //console.log("level:", level);
          if (tkey.includes(".")) {
            throw new Error("Can't use dot in key name");
          }

          //console.log("parentTKeys", parentTKeys, parentTKeys.length);
          if (typeof obj === "object") {
            parentTKeys.push(tkey);
            level++;
            transform(obj, gkey);
            level--;
          } else {
            const fullTKey =
              parentTKeys.length > 0 && typeof parentTKeys === "object"
                ? `${parentTKeys.join(".")}.${tkey}`
                : tkey;
            //console.log(fullTKey);
            if (tkey !== "")
              db.saveTranslation(gkey, fullTKey, pname, obj, account_id, lang);
          }
          parentTKeys = parentTKeys.slice(0, level);
        }
      };

      for (const [gkey, object] of Object.entries(translation)) {
        //parentTKeys = [];
        //console.log("----------------------- ");
        level = 0;
        if (gkey.includes(".")) {
          throw new Error("Can't use dot in key name");
        }
        if (typeof object === "string") {
          const fobj = {};
          fobj[`${gkey}`] = object;

          transform(fobj, "");
        } else {
          transform(object, gkey);
        }
      }
      //send response
      res.send({ status: "ok", filename });
    }
  } catch (err) {
    console.log("\n ------- err ------\n", err);
    res
      .status(500)
      .json({ err: "Error uploading file ", message: err.message });
  }
});

// SET VERIFIED LANGS OR NOT
router.put("/checked", async (req, res) => {
  const post = req.body.data;
  try {
    const checkeds = await db.updateChecked(post);
    //console.log("\n checkeds \n", checkeds);
    res.status(200).json(checkeds);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// RESTORE BACKUP
router.put("/restorebackup", async (req, res) => {
  const post = req.body.data;

  try {
    const r = await db.restoreBackup(post);
    console.log("\n resrored \n", r);
    res.status(200).json(r);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const translationId = req.params.id;
  const newChanges = req.body.data;

  try {
    const addChanges = await db.updateTranslation(translationId, newChanges);
    //console.log("\n addChanges \n", translationId, addChanges);
    res.status(200).json(addChanges);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const translationId = req.params.id;
  try {
    const deleting = await db.removeTranslation(translationId);
    console.log("deleting \n", deleting);
    res.status(204).json(deleting);
  } catch (err) {
    res.status(500).json({ err: "Error in deleting translation" });
  }
});

module.exports = router;
