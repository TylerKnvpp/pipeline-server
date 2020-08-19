const router = require("express").Router();

const Resource = require("../models/resources");

router.route("/").get((req, res) => {
  Resource.find({}, (mongoErr, resources) => {
    if (mongoErr) {
      res.json({ success: false, error: mongoErr });
      return;
    }

    res.json({ success: true, resources: resources });
  });
});

router.route("/:id").get((req, res) => {
  let pid = req.params.id;

  Resource.find({ pipelineID: pid }, (findErr, resources) => {
    if (findErr) {
      res.json({
        success: false,
        message: "Couldn't find any resources for this pipeline.",
        error: findErr,
      });
    }

    res.json({ success: true, resources: resources });
  });
});

router.route("/new").post((req, res) => {
  let newResource = new Resource({
    title: req.body.title,
    pipelineID: req.body.pipelineID,
    coverPhoto: req.body.coverPhoto,
    iconURL: req.body.iconURL,
    url: req.body.url,
    focus: req.body.focus,
    type: req.body.type,
  });

  newResource.save({}, (saveErr, resource) => {
    if (saveErr) {
      res.json({ success: false, error: saveErr });
      return;
    }

    res.json({ success: true, resource: resource });
  });
});

module.exports = router;
