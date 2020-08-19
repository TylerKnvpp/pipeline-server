const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: false, unique: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  state: { type: String, required: false },
  profilePicture: { type: String, required: false },
  skills: [{ type: String, required: false }],
  pipelineID: { type: Object },
  psts: [{ type: Object }],
});

module.exports = mongoose.model("User", UserSchema);
