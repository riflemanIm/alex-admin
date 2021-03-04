import db from "../config/dbConfig.js";

// GET ALL
const find = () => {
  const r = db("client_service");
  return r;
};
// GET  BY ID
const findById = (id) => {
  return db
    .select(
      "id",
      "label",
      "address",
      "file_server_address",
      "file_server_binding_name"
    )
    .from("client_service")
    .where("id", id);
};

// ADD
const addRow = (row) => {
  return db("client_service").insert(row);
};

// UPDATE
const updateRow = (id, post) => {
  return db("client_service").where("id", id).update(post);
};

// REMOVE
const removeRow = (id) => {
  return db("client_service").where("id", id).del();
};

module.exports = {
  find,
  findById,
  addRow,
  updateRow,
  removeRow,
};
