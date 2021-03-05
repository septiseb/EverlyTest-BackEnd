require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");

require("./configs/db.config");

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();
require("./configs/session.config")(app);

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"], // <== this will be the URL of our React app (it will be running on port 3000)
  })
);

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

hbs.registerPartials(__dirname + "/views/partials");
hbs.registerHelper("isOne", function (value) {
  return value === 1;
});
hbs.registerHelper("answer", function (value) {
  return value.filter((v) => v.answerTest).length;
});
hbs.registerHelper("average", function (value) {
  const total = value.filter((v) => v.grade).length;
  const totalSum = value.filter((v) => v.grade);
  let sum = 0;
  totalSum.forEach((s) => (sum += s.grade));
  return sum / total ? Number((sum / total).toFixed(0)) : 0;
});
hbs.registerHelper("colorScore", function (value) {
  if (value >= 80) {
    return "green";
  } else if (value >= 60) {
    return "yellow";
  } else {
    return "red";
  }
});

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

const index = require("./routes/index.routes");
const auth = require("./routes/auth.routes");
const test = require("./routes/exam.routes");
const tester = require("./routes/tester.routes");
app.use("/", index);
app.use("/api", auth);
app.use("/", test);
app.use("/", tester);

module.exports = app;
