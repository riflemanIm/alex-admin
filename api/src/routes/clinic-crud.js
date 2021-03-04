import express from "express";
import db from "../models/clinic-model.js";
//import { use } from "passport";
import multer from "multer";
const router = express.Router();
const path = require("path");
const { promisify } = require("util");
const fs = require("fs");
const unlinkAsync = promisify(fs.unlink);

// GET ALL CLINICS
router.get("/", async (req, res) => {
  try {
    const clinics = await db.find();
    console.log("GET ALL CLINICS\n\n", clinics);
    res.status(200).json(clinics);
  } catch (err) {
    res.status(500).json({ err });
  }
});

// GET CLINIC BY ID
router.get("/:id", async (req, res) => {
  const clinicId = req.params.id;
  try {
    const clinic = await db.findById(clinicId);
    if (!clinic) {
      res
        .status(404)
        .json({ err: "The clinic with the specified id does not exist" });
    } else {
      res.status(200).json(clinic);
    }
  } catch (err) {
    res.status({ err: "The clinic information could not be retrieved" });
  }
});

// INSERT CLINIC INTO DB
router.post("/", async (req, res) => {
  const d = req.body.data;
  try {
    await db.addRow(d);
    res.status(201).json("ok");
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .json({ err: "Error in adding Clinic", message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const newChanges = req.body.data;
  console.log("newChanges", newChanges);
  try {
    const addChanges = await db.updateRow(id, newChanges);
    console.log("\n addChanges\n", id, addChanges);
    res.status(200).json(addChanges);
  } catch (err) {
    res
      .status(500)
      .json({ err: "Error in updating region", message: err.message });
  }
});

// SAVE LOGO ON DISK, FILE NAME TO DB
let filename = "";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/clinics");
  },
  filename: (req, file, cb) => {
    const clinicId = req.params.id;
    filename = `clinic_${clinicId}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.put(
  "/upload-avatar/:id",
  upload.single("filedata"),
  async (req, res) => {
    try {
      if (!req.file) {
        res.send({
          status: false,
          message: "No file uploaded",
        });
      } else {
        const id = req.params.id;

        await db.saveLogo(id, filename);
        res.send({ status: "ok", filename });
      }
    } catch (err) {
      res.status(500).json({ err: "Error uploading file " });
    }
  }
);

router.delete("/upload-avatar/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const r = await db.findLogoById(id);
    await unlinkAsync(`images/clinics/${r.logo}`);
    await db.saveLogo(id, "");

    res.status(204).json({ status: "ok", filename: null });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const clinicId = req.params.id;
  try {
    const deleting = await db.removeRow(clinicId);
    console.log("deleting \n", deleting);
    res.status(204).json(deleting);
  } catch (err) {
    res.status(500).json({ err: "Error in deleting clinic" });
  }
});

module.exports = router;
