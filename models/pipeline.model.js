const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let DurationDetails = new mongoose.Schema({
  phaseTitle: { type: String, required: false },
  phaseDuration: { type: String, required: false },
  phaseDescription: [{ type: String, required: false }],
  phaseFocus: { type: String, required: false },
});

const PipelineSchema = new Schema({
  name: { type: String, required: true },
  nickname: { type: String, required: true },
  militaryBranch: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  durationDetails: [DurationDetails],

  skillsRequired: [{ type: String, required: false }],
  pipelineInisgnia: { type: String, required: false },
  pipelineCoverPhoto: { type: String, required: false },

  workouts: [{ type: Schema.Types.ObjectId, ref: "PipelineWorkout" }],
});

module.exports = mongoose.model("Pipeline", PipelineSchema);
