const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PipelineWorkoutSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  minumumScore: { type: Number, required: true },
  optimumScore: { type: Number, required: true },
  timeLimit: { type: String, required: true },
  equipment: { type: String, required: false },
  pipelineID: [{ type: Object }],
});

module.exports = mongoose.model("PipelineWorkout", PipelineWorkoutSchema);
