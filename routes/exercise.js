const router = require("express").Router();
let PipelineWorkout = require("../models/pipelineWorkout.model");

router.route("/").get((req, res) => {
  PipelineWorkout.find({}, (mongoErr, exercises) => {
    if (mongoErr) {
      res.json({ success: false, error: mongoErr });
      return;
    }

    res.json({ success: true, exercises: exercises });
  });
});

router.route("/:id").get((req, res) => {
  const eid = req.params.id;

  PipelineWorkout.findById(eid, (mongoErr, exercise) => {
    if (mongoErr) {
      res.json({ success: false, error: mongoErr });
      return;
    }

    res.json({ success: true, exercise: exercise });
  });
});

router.route("/new").post((req, res) => {
  let newExercise = new PipelineWorkout({
    title: req.body.title,
    description: req.body.description,
    minumumScore: req.body.minumumScore,
    optimumScore: req.body.optimumScore,
    timeLimit: req.body.timeLimit,
    equipment: req.body.equipment,
  });

  newExercise.save({}, (mongoErr, exercise) => {
    if (mongoErr) {
      res.json({ success: false, error: mongoErr });
      return;
    }

    res.json({ success: true, exercise: exercise });
  });
});

module.exports = router;
