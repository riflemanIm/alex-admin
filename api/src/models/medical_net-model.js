import db from "../config/dbConfig.js";

// GET ALL
const find = () => {
  const r = db("medical_net").orderBy("title");
  return r;
};
// GET  BY ID
const findById = (id) => {
  return db
    .select("title", "notify_email", "notify_phone", "code")
    .from("medical_net")
    .where("medical_net_id", id);
};

// ADD
const addRow = (row) => {
  return db("medical_net").insert(row);
};

// UPDATE
const updateRow = (id, post) => {
  return db("medical_net").where("medical_net_id", id).update(post);
};

// REMOVE
const removeRow = (id) => {
  return db("medical_net").where("medical_net_id", id).del();
};

module.exports = {
  find,
  findById,
  addRow,
  updateRow,
  removeRow,
};
