const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
var bodyParser = require("body-parser");
const settingRoute = require("./routes/setting");
const studentRoute = require("./routes/student");
const gradeRoute = require("./routes/grade");
const classDetailRoute = require("./routes/classDetail");
const classRoute = require("./routes/class");
const subjectRoute = require("./routes/subject");
const termRoute = require("./routes/term");
const subjectScoreRoute = require("./routes/subjectScore");
const termScoreRoute = require("./routes/termScore");
const paramRoute = require("./routes/param");
const subjectReportRoute = require("./routes/subjectReport");
const termReportRoute = require("./routes/termReport");
const userRoute = require("./routes/user");

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
app.use("/api/setting", settingRoute);
app.use("/api/student", studentRoute);
app.use("/api/grade", gradeRoute);
app.use("/api/class", classRoute);
app.use("/api/class-detail", classDetailRoute);
app.use("/api/subject", subjectRoute);
app.use("/api/param", paramRoute);
app.use("/api/term", termRoute);
app.use("/api/subject-score", subjectScoreRoute);
app.use("/api/term-score", termScoreRoute);
app.use("/api/subject-report", subjectReportRoute);
app.use("/api/term-report", termReportRoute);
app.use("/api/user", userRoute);

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
