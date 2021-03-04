//const db = require("../config/dbConfig.js");
import db from "../config/dbConfig.js";

// GET SPECIFIC CLINIC BY ID
const findById = (id) => {
  return db
    .select(
      "c.clinic_id",
      "c.code",
      "c.logo",
      "c.title",
      "c.url",
      "c.postal_address",
      "c.phone",
      "c.latitude",
      "c.longitude",

      "c.is_phone_required",
      "c.is_anonym_visit",
      "c.is_home_request",

      "c.medical_net_id",
      "c.client_service_id"
    )
    .from("clinic as c")
    .leftJoin("medical_net as mn", "c.medical_net_id", "mn.medical_net_id")
    .leftJoin("client_service as cs", "c.client_service_id", "cs.id")
    .first()
    .where("c.clinic_id", id);
};

// GET LOGO
const findLogoById = (id) => {
  return db
    .select("c.logo")
    .from("clinic as c")
    .first()
    .where("c.clinic_id", id);
};

// GET ALL CLINICS
const find = () => {
  const r = db
    .select(
      "c.clinic_id",
      "c.code",
      "c.logo",
      "c.title",
      "c.url",
      "c.postal_address",
      "c.phone",
      "c.latitude",
      "c.longitude",
      "c.is_phone_required",
      "c.is_anonym_visit",
      "c.is_home_request",
      "mn.title as net_name",
      "cs.label as service",
      "c.cdate"
    )
    .from("clinic as c")
    .leftJoin("medical_net as mn", "c.medical_net_id", "mn.medical_net_id")
    .leftJoin("client_service as cs", "c.client_service_id", "cs.id")
    .orderBy("c.cdate", "desc");

  return r;
};

// ADD
const addRow = (row) => {
  return db("clinic").insert(row);
};

// SAVE PHOTO FILE NAME
const saveLogo = (id, logo) => {
  return db("clinic").where("clinic_id", id).update({ logo });
};

// UPDATE
const updateRow = (id, post) => {
  return db("clinic").where("clinic_id", id).update(post);
};

// REMOVE
const removeRow = (id) => {
  return db("clinic").where("clinic_id", id).del();
};

module.exports = {
  find,
  findById,
  addRow,
  updateRow,
  removeRow,
  saveLogo,
  findLogoById,
};
