import express from "express";
import db from "../models/service-model.js";
//import { use } from "passport";
// import multer from "multer";
// const upload = multer();
const router = express.Router();

// GET ALL SERVICE
router.get("/", async (req, res) => {
  try {
    const services = await db.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ err });
  }
});

// GET  BY ID
router.get("/:id", async (req, res) => {
  const serviceId = req.params.id;
  try {
    const service = await db.findById(serviceId);
    if (!service) {
      res
        .status(404)
        .json({ err: "The service with the specified id does not exist" });
    } else {
      res.status(200).json(service[0]);
    }
  } catch (err) {
    res.status({ err: "The service information could not be retrieved" });
  }
});

// INSERT  INTO DB
router.post("/", async (req, res) => {
  const newService = req.body.data;

  try {
    await db.addRow(newService);
    res.status(201).json("ok");
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .json({ err: "Error in adding service", message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const serviceId = req.params.id;
  const newChanges = req.body.data;

  try {
    const addChanges = await db.updateRow(serviceId, newChanges);
    console.log("\n addChanges\n", serviceId, addChanges);
    res.status(200).json(addChanges);
  } catch (err) {
    res
      .status(500)
      .json({ err: "Error in updating service", message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const serviceId = req.params.id;
  try {
    const deleting = await db.removeRow(serviceId);
    console.log("deleting \n", deleting);
    res.status(204).json(deleting);
  } catch (err) {
    res
      .status(500)
      .json({ err: "Error in deleting service", message: err.message });
  }
});

module.exports = router;
