const express = require("express");
const app = express();
require("dotenv").config();
// const graphqlHTTP = require("express-graphql");
// const schema = require("./schema/schema");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 4000;
const uri = process.env.MONGODB_URI;
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));

let connected = false;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  connected = true;
  console.log("Cluster has been connected");
});

app.get("/", (req, res, err) => {
  res.json({
    hello: "world",
    mongo: connected,
  });
});

// app.use(
//   "/",
//   graphqlHTTP({
//     schema,
//     graphiql: true,
//   })
// );

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const pipelineRouter = require("./routes/pipeline");
app.use("/pipelines", pipelineRouter);

const exerciseRouter = require("./routes/exercise");
app.use("/exercises", exerciseRouter);

const resourceRouter = require("./routes/resources");
app.use("/resources", resourceRouter);

app.listen(PORT, () => {
  console.log(`Server running on: ${PORT}`);
});
