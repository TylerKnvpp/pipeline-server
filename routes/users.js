const router = require("express").Router();

let User = require("../Models/user.model");
let UserWorkout = require("../Models/userWorkout.model");
let PipelineWorkout = require("../models/pipelineWorkout.model");

router.route("/").get((req, res) => {
  User.find({}, (mongoErr, users) => {
    if (mongoErr) res.json({ success: false, error: mongoErr });
    if (users) res.json({ success: true, users: users });
  });
});

router.route("/:id").get((req, res) => {
  User.findById(req.params.id, (mongoErr, user) => {
    if (mongoErr) res.json({ success: false, error: mongoErr });
    if (user) res.json({ success: true, user: user });
  });
});

router.route("/:id/workouts").get((req, res) => {
  UserWorkout.find({ userID: req.params.id }, (mongoErr, exercises) => {
    if (mongoErr) res.json({ success: false, error: mongoErr });

    if (exercises) {
      let workoutIDs = [];

      exercises.forEach((exercise) =>
        workoutIDs.push(exercise.pipelineWorkoutID)
      );

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
          }
          res.json({ success: true, exercises: exercises, records: records });
        });
    }
  });
});

router.route("/:id/add-pipeline").post((req, res) => {
  let uid = req.params.id;
  let update = {
    pipelineID: req.body.pipelineID,
  };

  User.findByIdAndUpdate(uid, update, { new: true }, (mongoErr, user) => {
    if (mongoErr) {
      res.json({ success: false, error: mongoErr });
    }

    res.json({ success: true, user: user });
  });
});

router.route("/:id/update-profile").post((req, res) => {
  let uid = req.params.id;
  let update = req.body.update;

  User.findByIdAndUpdate(uid, update, { new: true }, (mongoErr, user) => {
    if (mongoErr) {
      res.json({ success: false, error: mongoErr });
    }
    res.json({ success: true, user: user });
  });
});

router.route("/:id/add-skills").post((req, res) => {
  const skillsReq = req.body.skills;
  const update = { skills: skillsReq };
  User.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true },
    (mongoErr, user) => {
      if (mongoErr) {
        res.json({ success: false, error: mongoErr });
        return;
      }

      res.json(user);
    }
  );
});

router.route("/:id/log-workout/:workoutID").post((req, res) => {
  const uid = req.params.id;
  const wid = req.params.workoutID;

  User.findById(uid, (findError, user) => {
    if (findError) {
      res.json({ success: false, error: findError });
      return;
    }

    let userWorkouts = user.workouts;

    let newUserExerciseLog = new UserWorkout({
      userScore: req.body.userScore,
      userID: uid,
      pipelineWorkoutID: wid,
    });

    newUserExerciseLog.save({}, (loggingError, loggedExercise) => {
      if (loggingError) {
        res.json({ success: false, error: loggingError });
        return;
      }

      user.workouts = [...userWorkouts, loggedExercise];

      user.save({}, (updateError, user) => {
        if (updateError) {
          res.json({ success: false, error: updateError });
          return;
        }

        res.json({ success: true, log: loggedExercise, user: user });
      });
    });
  });
});

const upload = require("../services/ImageUpload");
const singleUpload = upload.single("image");

router.post("/:id/add-profile-picture", function (req, res) {
  const uid = req.params.id;

  singleUpload(req, res, function (err) {
    if (err) {
      return res.json({
        success: false,
        errors: {
          title: "Image Upload Error",
          detail: err.message,
          error: err,
        },
      });
    }

    let update = { profilePicture: req.file.location };

    User.findByIdAndUpdate(uid, update, { new: true }, (mongoErr, user) => {
      if (mongoErr) {
        res.json({ success: false, error: mongoErr });
      }

      res.json({ success: true, user: user });
    });
  });
});

module.exports = router;
