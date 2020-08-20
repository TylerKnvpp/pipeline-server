const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PipelineWorkoutSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  minumumScore: { type: Number, required: true },
  optimumScore: { type: Number, required: true },
  timeLimit: { type: String, required: true },
  equipment: { type: String, required: false },
  icon: { type: String, required: false },
  type: { type: String, required: true },
  pipelineID: [{ type: Object }],
  order: { type: Number, required: true },
});

module.exports = mongoose.model("PipelineWorkout", PipelineWorkoutSchema);
