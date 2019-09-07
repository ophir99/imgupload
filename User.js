const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: "string",
  email: "string",
  img: "string"
});

const user = mongoose.model("user", schema);
module.exports = user;
