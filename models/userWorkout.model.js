const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserWorkoutSchema = new Schema({
  userScore: { type: Number, required: true },
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pipelineWorkoutID: {
    type: Schema.Types.ObjectId,
    ref: "PipelineWorkout",
    required: true,
  },
});

module.exports = mongoose.model("UserWorkout", UserWorkoutSchema);
