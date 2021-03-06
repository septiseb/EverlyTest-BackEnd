require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
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
    origin: [process.env.FRONTEND, "http://localhost:3000"], // <== this will be the URL of our React app (it will be running on port 3000)
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

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

const index = require("./routes/index.routes");
const auth = require("./routes/auth.routes");
const user = require("./routes/exam.routes");
const tester = require("./routes/tester.routes");
const stripe = require("./routes/stripe.routes");
app.use("/", index);
app.use("/api", auth);
app.use("/user", user);
app.use("/tester", tester);
app.use("/payment", stripe);

module.exports = app;
