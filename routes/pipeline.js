const router = require("express").Router();

let Pipeline = require("../models/pipeline.model");
let PipelineWorkout = require("../models/pipelineWorkout.model");

router.route("/").get((req, res) => {
  Pipeline.find({}, (mongoErr, pipelines) => {
    if (mongoErr) {
      res.json({ success: false, error: mongoErr });
      return;
    }

    res.json({ success: true, pipelines: pipelines });
  });
});

router.route("/:id").get((req, res) => {
  let pid = req.params.id;

  Pipeline.findById(pid, (mongoErr, pipeline) => {
    if (mongoErr) {
      res.json({ success: false, error: mongoErr });
      return;
    }

    res.json({ success: true, pipeline: pipeline });
  });
});

router.route("/:id/get-workouts").get((req, res) => {
  let pid = req.params.id;

  Pipeline.findById(pid, (mongoErr, pipeline) => {
    if (mongoErr) {
      res.json({ success: false, pipeline: pipeline });
      return;
    }

    let workoutIDs = pipeline.workouts;

    PipelineWorkout.find()
      .where("_id")
      .in(workoutIDs)
      .exec((monErr, records) => {
        if (monErr) {
          res.json({
            success: false,
            message: "Couldn't find logs.",
            error: monErr,
          });
          return;
        }

        res.json({
          success: true,
          pipeline: pipeline,
          records: records,
        });
      });
  });
});

router.route("/add-pipeline").post((req, res) => {
  let newPipeline = new Pipeline({
    name: req.body.name,
    nickname: req.body.nickname,
    militaryBranch: req.body.militaryBranch,
    description: req.body.description,
    duration: req.body.duration,
  });

  newPipeline.save({}, (mongoErr, pipeline) => {
    if (mongoErr) {
      res.json({ sucess: false, mongoErr });
      return;
    }

    res.json({ sucess: true, pipeline: pipeline });
  });
});

router.route("/:id/add-skills").post((req, res) => {
  const pid = req.params.id;

  let update = {
    skillsRequired: req.body.skillsRequired,
  };

  Pipeline.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true },
    (mongoErr, pipeline) => {
      if (mongoErr) {
        res.json({ success: false, error: mongoErr });
        return;
      }

      res.json({ success: true, pipeline: pipeline });
    }
  );
});

router.route("/:id/add-duration-details").post((req, res) => {
  const pid = req.params.id;

  let update = {
    durationDetails: req.body.durationDetails,
  };

  Pipeline.findByIdAndUpdate(
    pid,
    update,
    { new: true },
    (mongoErr, pipeline) => {
      if (mongoErr) {
        res.json({ success: false, error: mongoErr });
        return;
      }

      res.json({ success: true, pipeline: pipeline });
    }
  );
});

router.route("/:id/add-workouts").post((req, res) => {
  let pid = req.params.id;
  let workoutIDs = req.body.workoutIDs;

  PipelineWorkout.find()
    .where("_id")
    .in(workoutIDs)
    .exec((monErr, records) => {
      if (monErr) {
        res.json({
          success: false,
          message: "Couldn't find logs.",
          error: monErr,
        });
        return;
      }

      let update = {
        workouts: records,
      };

      Pipeline.findByIdAndUpdate(
        pid,
        update,
        { new: true },
        (mongoErr, updatedPipeline) => {
          if (mongoErr) {
            res.json({
              success: false,
              message: "Couldn't add workouts.",
              error: mongoErr,
            });
          }

          res.json({
            success: true,
            pipeline: updatedPipeline,
          });
        }
      );
    });
});

module.exports = router;
