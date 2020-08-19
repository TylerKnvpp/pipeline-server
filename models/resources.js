const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
  title: { type: String, required: true },
  pipelineID: { type: String, required: false },
  coverPhoto: { type: String, required: false },
  iconURL: { type: String, required: false },
  url: { type: String, required: true },
  focus: { type: String, required: false },
  type: { type: String, required: true },
});

module.exports = mongoose.model("Resource", ResourceSchema);
