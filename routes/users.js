const router = require("express").Router();

let User = require("../models/user.model");
let PST = require("../models/physicalScreeningTest.model");
let PipelineWorkout = require("../models/pipelineWorkout.model");
let Pipeline = require("../models/pipeline.model");

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

  Pipeline.findById(req.body.pipelineID, (pipeErr, pipeline) => {
    let update = {
      pipelineID: pipeline,
    };

    User.findByIdAndUpdate(uid, update, { new: true }, (mongoErr, user) => {
      if (mongoErr) {
        res.json({ success: false, error: mongoErr });
      }

      res.json({ success: true, user: user });
    });
  });
});

router.route("/:id/update-profile").post((req, res) => {
  let uid = req.params.id;
  let update = req.body.update;

  console.log(req.body.update);

  User.findByIdAndUpdate(uid, update, { new: true }, (mongoErr, user) => {
    if (mongoErr) {
      res.json({
        success: false,
        error: mongoErr,
        message: "Couldn't update profile.",
      });
      return;
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

      console.log(user);

      res.json({ success: true, user: user });
    }
  );
});

router.route("/:id/log-pst").post((req, res) => {
  const uid = req.params.id;
  const evos = req.body.evolutions;
  const unitInignia = req.body.unitInsignia;
  const unitName = req.body.nickname;

  let pids = [];
  let failedEvos = [];
  let passedEvos = [];
  let pass = true;

  if (req.body.evolutions.length) {
    req.body.evolutions.forEach((evo) => {
      pids.push(evo.pipelineWorkoutID);
    });
  }

  PipelineWorkout.find()
    .where("_id")
    .in(pids)
    .exec((monErr, records) => {
      if (monErr) {
        res.json({
          success: false,
          message: "Couldn't find logs.",
          error: monErr,
        });
        return;
      }

      evos.forEach((evo) => {
        let comparetor = records.find((record) => {
          return record._id == evo.pipelineWorkoutID;
        });

        if (comparetor.type === "timed") {
          if (evo.userScore > comparetor.minumumScore) {
            pass = false;
            failedEvos.push({
              workout: comparetor,
              userEvolution: evo.userScore,
            });
          } else {
            passedEvos.push({
              workout: comparetor,
              userEvolution: evo.userScore,
            });
          }
        }

        if (comparetor.type === "reps") {
          if (evo.userScore < comparetor.minumumScore) {
            pass = false;
            failedEvos.push({
              workout: comparetor,
              userEvolution: evo.userScore,
            });
          } else {
            passedEvos.push({
              workout: comparetor,
              userEvolution: evo.userScore,
            });
          }
        }
      });

      let newUserPST = new PST({
        userID: uid,
        evolutions: req.body.evolutions,
        pass: pass,
        unitInsignia: unitInignia,
        nickname: unitName,
        failedUserEvolutions: failedEvos,
        passedUserEvolutions: passedEvos,
      });

      newUserPST.save({}, (saveErr, savedPST) => {
        if (saveErr) {
          res.json({
            success: false,
            message: "Couldn't save PST.",
            error: saveErr,
          });
          return;
        }

        User.updateOne(
          { _id: uid },
          { $push: { psts: savedPST } },
          (updateErr, success) => {
            if (updateErr) {
              res.json({ success: false, message: "Could not save to user." });
              return;
            }

            res.json({
              success: true,
              pst: savedPST,
            });
          }
        );
      });
    });
});

router.route("/:id/get-psts/").get((req, res) => {
  const uid = req.params.id;
  const pid = req.params.pid;

  PST.find({ userID: uid }, (findErr, psts) => {
    if (findErr) {
      res.json({
        succes: false,
        message: "Couldn't find psts.",
        error: findErr,
      });
      return;
    }

    res.json({
      success: true,
      psts: psts,
    });
  });
});

router.route("/:id/get-pst/:pid").get((req, res) => {
  const uid = req.params.id;
  const pid = req.params.pid;

  PST.findById(pid, (findErr, pst) => {
    if (findErr) {
      res.json({
        success: false,
        message: "Couldn't find PST.",
        error: findErr,
      });
    }

    let pipelineWorkoutIDs = [];

    pst.evolutions.forEach((evo) =>
      pipelineWorkoutIDs.push(evo.pipelineWorkoutID)
    );

    PipelineWorkout.find()
      .where("_id")
      .in(pipelineWorkoutIDs)
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
          pst: pst,
          records: records,
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

router.get("/:id/get-latest-pst", (req, res) => {
  const uid = req.params.id;

  PST.find({ userID: uid }, (findErr, psts) => {
    if (findErr) {
      res.json({
        succes: false,
        message: "Couldn't find psts.",
        error: findErr,
      });
      return;
    }

    const lastIndex = psts.length - 1;

    res.json({
      success: true,
      latestPST: psts[lastIndex],
    });
  });
});

router.get("/:id/get-friends", (req, res) => {
  User.findById(req.params.id, (findErr, user) => {
    if (findErr) {
      res.status.apply(400).json({
        success: false,
        error: findErr,
      });
    }

    User.find()
      .where("_id")
      .in(user.friends)
      .exec((monErr, records) => {
        if (monErr) {
          res.json({
            success: false,
            message: "Couldn't find logs.",
            error: monErr,
          });
          return;
        }

        res.status(200).json({
          success: true,
          friends: records,
        });
      });
  });
});

router.get("/:id/get-requests", (req, res) => {
  User.findById(req.params.id, (findErr, user) => {
    if (findErr) {
      res.status.apply(400).json({
        success: false,
        error: findErr,
      });
    }

    User.find()
      .where("_id")
      .in(user.friendRequests)
      .exec((monErr, records) => {
        if (monErr) {
          res.json({
            success: false,
            message: "Couldn't find logs.",
            error: monErr,
          });
          return;
        }

        res.status(200).json({
          success: true,
          users: records,
        });
      });
  });
});

router.post("/:requester/friend-request/:requested", (req, res) => {
  const requester = req.params.requester;
  const requested = req.params.requested;

  User.updateOne(
    { _id: requester },
    { $push: { sentFriendRequestsPending: requested } },
    (updateErr, success) => {
      if (updateErr) {
        res.json({ success: false, message: "Could not save to user." });
        return;
      }

      if (success) {
        User.updateOne(
          { _id: requested },
          { $push: { friendRequests: requester } },
          (updateErr, success) => {
            if (updateErr) {
              res.json({ success: false, message: "Could not save to user." });
              return;
            }

            if (success) {
              res.status(200).json({
                success: true,
                message: "Request sent!",
              });
            }
          }
        );
      }
    }
  );
});

router.post("/:accepter_id/accept-request/:accepted_id", (req, res) => {
  console.log("asdf");
  const requested = req.params.accepter_id;
  const requester = req.params.accepted_id;

  User.updateOne(
    { _id: requester },
    { $push: { friends: requested } },
    (updateErr, success) => {
      if (updateErr) {
        res.json({ success: false, message: "Could not save to user." });
        return;
      }

      User.updateOne(
        { _id: requester },
        { $pull: { sentFriendRequestsPending: requested } },
        (pullErr, pullSuccess) => {
          if (updateErr) {
            res.json({ success: false, message: "Could not save to user." });
            return;
          }
        }
      );

      if (success) {
        User.updateOne(
          { _id: requested },
          { $push: { friends: requester } },

          (updateErr, success) => {
            if (updateErr) {
              res.json({ success: false, message: "Could not save to user." });
              return;
            }

            User.updateOne(
              { _id: requested },

              { $pull: { friendRequests: requester } },
              (updateErr, success) => {
                if (updateErr) {
                  res.json({
                    success: false,
                    message: "Could not save to user.",
                  });
                  return;
                }
              }
            );

            if (success) {
              res.status(200).json({
                success: true,
                message: "Request sent!",
              });
            }
          }
        );
      }
    }
  );
});

router.post("/:uid/decline-request/:requester_id", (req, res) => {
  const userDeclining = req.params.uid;
  const userDeclined = req.params.requester_id;

  User.update(
    { _id: userDeclining },
    { $pull: { friendRequests: userDeclined } },
    (updateErr, success) => {
      if (updateErr) {
        res.status(400).json({ success: false, error: success });
      }

      res.json({
        success: true,
        message: "Friend request denied.",
      });
    }
  );
});

router.post("/search", (req, res) => {
  const searchTerm = req.body.searchInput;

  User.find(
    { username: { $regex: searchTerm, $options: "i" } },
    (err, docs) => {
      if (err) {
        return res.json({
          success: false,
          message: "Couldn't complete Search.",
          error: err,
        });
      }

      res.json({ success: true, users: docs });
    }
  );
});

module.exports = router;
