const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
var bodyParser = require("body-parser");
const settingRoute = require("./api/routes/setting");
const studentRoute = require("./api/routes/student");
const gradeRoute = require("./api/routes/grade");
const classDetailRoute = require("./api/routes/classDetail");
const classRoute = require("./api/routes/class");
const subjectRoute = require("./api/routes/subject");
const termRoute = require("./api/routes/term");
const subjectScoreRoute = require("./api/routes/subjectScore");
const termScoreRoute = require("./api/routes/termScore");
const paramRoute = require("./api/routes/param");
const subjectReportRoute = require("./api/routes/subjectReport");
const termReportRoute = require("./api/routes/termReport");
const userRoute = require("./api/routes/user");

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
dotenv.config();
app.use(express.json());

//ROUTES
app.use("/api/v1/setting", settingRoute);
app.use("/api/v1/student", studentRoute);
app.use("/api/v1/grade", gradeRoute);
app.use("/api/v1/class", classRoute);
app.use("/api/v1/class-detail", classDetailRoute);
app.use("/api/v1/subject", subjectRoute);
app.use("/api/v1/param", paramRoute);
app.use("/api/v1/term", termRoute);
app.use("/api/v1/subject-score", subjectScoreRoute);
app.use("/api/v1/term-score", termScoreRoute);
app.use("/api/v1/subject-report", subjectReportRoute);
app.use("/api/v1/term-report", termReportRoute);
app.use("/api/v1/user", userRoute);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(5000, () => {
  console.log("Backend is running on port 5000");
});
