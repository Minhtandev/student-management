const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
var bodyParser = require("body-parser");
const settingRoute = require("./src/routes/setting");
const studentRoute = require("./src/routes/student");
const gradeRoute = require("./src/routes/grade");
const classDetailRoute = require("./src/routes/classDetail");
const classRoute = require("./src/routes/class");
const subjectRoute = require("./src/routes/subject");
const termRoute = require("./src/routes/term");
const subjectScoreRoute = require("./src/routes/subjectScore");
const termScoreRoute = require("./src/routes/termScore");
const paramRoute = require("./src/routes/param");
const subjectReportRoute = require("./src/routes/subjectReport");
const termReportRoute = require("./src/routes/termReport");
const userRoute = require("./src/routes/user");

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
