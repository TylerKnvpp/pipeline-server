const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserPST = new Schema(
  {
    userScore: { type: Number, required: true },
    userID: {
      type: String,
      required: true,
    },
    pipelineWorkoutID: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const PSTSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    evolutions: [UserPST],
    pass: { type: Boolean, required: true },
    unitInsignia: { type: String, required: true },
    nickname: { type: String, required: true },
    failedUserEvolutions: [{ type: Object }],
    passedUserEvolutions: [{ type: Object }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("PST", PSTSchema);
