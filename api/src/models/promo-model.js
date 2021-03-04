//const db = require("../config/dbConfig.js");
import db from "../config/dbConfig.js";
import { isoToDateTime } from "../helpers/helpers";

// GET ALL PROMOS
const find = () => {
  const r = db("medicalnet_actions");
  return r;
};
// GET SPECIFIC PROMO BY ID
const findById = (id) => {
  return db("medicalnet_actions").where("medicalnet_actions_id", id);
};

// ADD A PROMO
const addPromo = (post) => {
  return db("medicalnet_actions").insert({
    ...post,
    date_to: isoToDateTime(post.date_to),
    date_from: isoToDateTime(post.date_from),
  });
};

// UPDATE PROMO
const updatePromo = (id, post) => {
  //console.log("updatePromo", id, post);
  delete post.medicalnet_actions_id;

  return db("medicalnet_actions")
    .where("medicalnet_actions_id", id)
    .update({
      ...post,
      date_to: isoToDateTime(post.date_to),
      date_from: isoToDateTime(post.date_from),
    });
};

// REMOVE PROMO
const removePromo = (id) => {
  return db("medicalnet_actions").where("medicalnet_actions_id", id).del();
};

module.exports = {
  find,
  findById,
  addPromo,
  updatePromo,
  removePromo,
};
