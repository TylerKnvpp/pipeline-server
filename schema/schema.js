// const graphql = require("graphql");
// const {
//   GraphQLObjectType,
//   GraphQLID,
//   GraphQLString,
//   GraphQLList,
//   GraphQLSchema,
//   GraphQLNonNull,
//   GraphQLInt,
// } = graphql;

// const _ = require("lodash");

// const User = require("../models/user.model");
// const UserWorkout = require("../models/userWorkout.model");
// const Pipeline = require("../models/pipeline.model");
// const PipelineWorkout = require("../models/pipelineWorkout.model");

// const UserType = new GraphQLObjectType({
//   name: "User",
//   fields: () => ({
//     id: { type: GraphQLID },
//     firstName: { type: GraphQLString },
//     lastName: { type: GraphQLString },
//     state: { type: GraphQLString },
//     profilePicture: { type: GraphQLString },
//     skills: { type: GraphQLString },
//     pipeline: {
//       type: PipelineType,
//       resolve(parent, args) {
//         return Pipeline.findById(parent.pipelineID);
//       },
//     },
//     workouts: {
//       type: new GraphQLList(UserWorkoutType),
//       resolve(parent, args) {
//         return UserWorkout.find({ userID: parent.id });
//       },
//     },
//   }),
// });

// const PipelineType = new GraphQLObjectType({
//   name: "Pipeline",
//   fields: () => ({
//     id: { type: GraphQLID },
//     name: { type: GraphQLString },
//     nickname: { type: GraphQLString },
//     militaryBranch: { type: GraphQLString },
//     description: { type: GraphQLString },
//     duration: { type: GraphQLString },
//     durationDetails: {
//       phaseTitle: { type: GraphQLString },
//       phaseDuration: { type: GraphQLString },
//       phaseDescription: { type: GraphQLString },
//     },
//     skillsRequired: { type: GraphQLString },
//     pipelineInisgnia: { type: GraphQLString },
//     pipelineCoverPhoto: { type: GraphQLString },

//     workouts: {
//       type: new GraphQLList(PipelineWorkoutType),
//       resolve(parent, args) {
//         return PipelineWorkout.find({ id: parent.workouts });
//       },
//     },
//   }),
// });

// const PipelineWorkoutType = new GraphQLObjectType({
//   name: "PipelineWorkout",
//   fields: () => ({
//     id: { type: GraphQLID },
//     title: { type: GraphQLString },
//     description: { type: GraphQLString },
//     minumumScore: { type: GraphQLInt },
//     optimumScore: { type: GraphQLInt },
//     timeLimit: { type: GraphQLString },
//     equipment: { type: GraphQLString },
//     pipelineID: [{ type: GraphQLID }],
//   }),
// });

// const UserWorkoutType = new GraphQLObjectType({
//   name: "UserWorkoutType",
//   fields: () => ({
//     userScore: { type: GraphQLInt },
//     userID: { type: GraphQLID },
//     pipelineWorkoutID: { type: GraphQLID },
//   }),
// });

// const RootQuery = new GraphQLObjectType({
//   name: "RootQueryType",
//   fields: {
//     users: {
//       type: new GraphQLList(UserType),
//       resolve(parent, args) {
//         return User.find({});
//       },
//     },
//     pipelines: {
//       type: new GraphQLList(PipelineType),
//       resolve(parent, args) {
//         return Pipeline.find({});
//       },
//     },
//     pipelineWorkouts: {
//       type: new GraphQLList(PipelineWorkoutType),
//       resolve(parent, args) {
//         return PipelineWorkout.find({});
//       },
//     },
//     userWorkouts: {
//       type: new GraphQLList(UserWorkoutType),
//       resolve(parent, args) {
//         return UserWorkout.find({});
//       },
//     },
//     user: {
//       type: UserType,
//       args: { id: { type: GraphQLID } },
//       resolve(parent, args) {
//         return User.findById(args.id);
//       },
//     },
//     pipeline: {
//       type: PipelineType,
//       args: { id: { type: GraphQLID } },
//       resolve(parent, args) {
//         return Pipeline.findById(args.id);
//       },
//     },
//     pipelineWorkout: {
//       type: PipelineWorkoutType,
//       args: { id: { type: GraphQLID } },
//       resolve(parent, args) {
//         return PipelineWorkout.findById(args.id);
//       },
//     },
//     userWorkout: {
//       type: UserWorkoutType,
//       args: { id: { type: GraphQLID } },
//       resolve(parent, args) {
//         return UserWorkout.findById(args.id);
//       },
//     },
//   },
// });

// const Mutation = new GraphQLObjectType({
//   name: "Mutation",
//   fields: {
//     //
//     addUser: {
//       UserType,
//       args: {
//         username: { type: new GraphQLNonNull(GraphQLString) },
//         firstName: { type: new GraphQLNonNull(GraphQLString) },
//         lastName: { type: new GraphQLNonNull(GraphQLString) },
//         state: { type: new GraphQLNonNull(GraphQLString) },
//         profilePicture: { type: new GraphQLNonNull(GraphQLString) },
//         skills: [GraphQLString],
//         pipelineID: { type: new GraphQLNonNull(GraphQLString) },
//       },
//       resolve(parent, args) {
//         const newUser = new User({
//           username: args.username,
//           firstName: args.firstName,
//           lastName: args.lastName,
//           state: args.state,
//           profilePicture: args.profilePicture,
//           skills: args.skills,
//           pipelineID: args.pipelineID,
//         });

//         return newUser.save();
//       },
//     },
//     //
//     addPipeline: {
//       PipelineType,
//       args: {
//         name: { type: new GraphQLNonNull(GraphQLString) },
//         nickname: { type: new GraphQLNonNull(GraphQLString) },
//         militaryBranch: { type: new GraphQLNonNull(GraphQLString) },
//         description: { type: new GraphQLNonNull(GraphQLString) },
//         duration: { type: new GraphQLNonNull(GraphQLString) },
//         durationDetails: {
//           phaseTitle: { type: new GraphQLNonNull(GraphQLString) },
//           phaseDuration: { type: new GraphQLNonNull(GraphQLString) },
//           phaseDescription: { type: new GraphQLNonNull(GraphQLString) },
//         },
//         skillsRequired: { type: GraphQLString },
//         pipelineInisgnia: { type: new GraphQLNonNull(GraphQLString) },
//         pipelineCoverPhoto: { type: new GraphQLNonNull(GraphQLString) },

//         workouts: [PipelineWorkoutType],
//       },
//       resolve(parent, args) {
//         const newPipeline = new Pipeline({
//           name: args.name,
//           nickname: args.nickname,
//           militaryBranch: args.militaryBranch,
//           description: args.description,
//           duration: args.duration,
//           durationDetails: {
//             phaseTitle: args.phaseTitle,
//             phaseDuration: args.phaseDuration,
//             phaseDescription: args.phaseDescription,
//           },
//           skillsRequired: args.skillsRequired,
//           pipelineInisgnia: args.pipelineInisgnia,
//           pipelineCoverPhoto: args.pipelineCoverPhoto,

//           workouts: [WorkoutType],
//         });

//         return newPipeline.save();
//       },
//     },
//     //
//     addPipelineWorkout: {
//       PipelineWorkoutType,
//       args: {
//         title: { type: new GraphQLNonNull(GraphQLString) },
//         description: { type: new GraphQLNonNull(GraphQLString) },
//         minumumScore: { type: new GraphQLNonNull(GraphQLInt) },
//         optimumScore: { type: new GraphQLNonNull(GraphQLInt) },
//         timeLimit: { type: new GraphQLNonNull(GraphQLString) },
//         equipment: { type: new GraphQLNonNull(GraphQLString) },
//         pipelineID: [GraphQLID],
//       },
//       resolve(parent, args) {
//         const newPipelineWorkout = new PipelineWorkout({
//           title: args.title,
//           description: args.description,
//           minumumScore: args.minumumScore,
//           optimumScore: args.optimumScore,
//           timeLimit: args.timeLimit,
//           equipment: args.equipment,
//           pipelineID: args.pipelineID,
//         });
//         return newPipelineWorkout.save();
//       },
//     },
//     addUserWorkout: {
//       UserWorkoutType,
//       args: {
//         userScore: { type: new GraphQLNonNull(GraphQLInt) },
//         userID: { type: new GraphQLNonNull(GraphQLID) },
//         pipelineWorkoutID: { type: new GraphQLNonNull(GraphQLID) },
//       },
//       resolve(parent, args) {
//         const newUserWorkout = new UserWorkout({
//           userScore: args.userScore,
//           userID: args.userID,
//           pipelineWorkoutID: args.pipelineWorkoutID,
//         });
//         return newUserWorkout.save();
//       },
//     },
//   },
// });

// module.exports = new GraphQLSchema({
//   query: RootQuery,
//   mutation: Mutation,
// });
