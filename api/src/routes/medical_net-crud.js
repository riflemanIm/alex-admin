import express from "express";
import db from "../models/medical_net-model.js";
//import { use } from "passport";
// import multer from "multer";
// const upload = multer();
const router = express.Router();

// GET ALL MEDICAL_NET
router.get("/", async (req, res) => {
  try {
    const medical_net = await db.find();
    res.status(200).json(medical_net);
  } catch (err) {
    res.status(500).json({ err });
  }
});

// GET  BY ID
router.get("/:id", async (req, res) => {
  const medicalNetId = req.params.id;
  try {
    const medical_net = await db.findById(medicalNetId);
    if (!medical_net) {
      res
        .status(404)
        .json({ err: "The medical_net with the specified id does not exist" });
    } else {
      res.status(200).json(medical_net[0]);
    }
  } catch (err) {
    res.status({ err: "The medical_net information could not be retrieved" });
  }
});

// INSERT  INTO DB
router.post("/", async (req, res) => {
  const newMedicalNet = req.body.data;

  try {
    await db.addRow(newMedicalNet);
    res.status(201).json("ok");
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .json({ err: "Error in adding medical_net", message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const medicalNetId = req.params.id;
  const newChanges = req.body.data;

  try {
    const addChanges = await db.updateRow(medicalNetId, newChanges);
    console.log("\n addChanges\n", medicalNetId, addChanges);
    res.status(200).json(addChanges);
  } catch (err) {
    res
      .status(500)
      .json({ err: "Error in updating medical_net", message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const medicalNetId = req.params.id;
  try {
    const deleting = await db.removeRow(medicalNetId);
    console.log("deleting \n", deleting);
    res.status(204).json(deleting);
  } catch (err) {
    res
      .status(500)
      .json({ err: "Error in deleting medical_net", message: err.message });
  }
});

module.exports = router;
