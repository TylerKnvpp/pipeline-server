const router = require("express").Router();

let Pipeline = require("../models/pipeline.model");

router.route("/").get((req, res) => {
  Pipeline.find({}, (mongoErr, pipelines) => {
    if (mongoErr) {
      res.json(mongoErr);
      return;
    }

    res.json(pipelines);
  });
});

router.route("/:id").get((req, res) => {
  let pid = req.params.pid;

  Pipeline.findById(pid, (mongoErr, pipeline) => {
    if (err) {
      res.json(mongoErr);
      return;
    }

    res.json(pipeline);
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
    skillsRequired: req.body.skills,
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

module.exports = router;
