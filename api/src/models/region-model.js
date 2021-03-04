//const db = require("../config/dbConfig.js");
import db from "../config/dbConfig.js";

// GET ALL REGIONS
const find = () => {
  const r = db.select("region_id", "title", "sort").from("region");
  return r;
};
// GET SPECIFIC REGION BY ID
const findById = (id) => {
  return db
    .select("region_id", "title", "sort")
    .from("region")
    .where("region_id", id);
};

// ADD A REGION
const addRegion = (region) => {
  return db("region").insert(region);
};

// UPDATE REGION
const updateRegion = (id, post) => {
  return db("region").where("region_id", id).update(post);
};

// REMOVE REGION
const removeRegion = (id) => {
  return db("region").where("region_id", id).del();
};

module.exports = {
  find,
  findById,
  addRegion,
  updateRegion,
  removeRegion,
};
