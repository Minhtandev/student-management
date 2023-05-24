const mongoose = require("mongoose");

//Định nghĩa một cài đặt
const settingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

//Định nghĩa một học sinh
const studentSchema = new mongoose.Schema(
  {
    ID: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    birth: String,
    address: String,
    image: String,
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    editor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // classes: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "ClassDetail",
    //   },
    // ],
  },
  { timestamps: true }
);

//Định nghĩa một khối
const gradeSchema = new mongoose.Schema({
  name: {
    type: Number,
    required: true,
    unique: true,
  },
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
});

//Định nghĩa một danh sách lớp
const classDetailSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    schoolYear: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    editor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    formTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//Định nghĩa lớp cố định
const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grade",
  },
});

//Định nghĩa một môn học
const subjectSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

//điểm 1 môn học của 1 học sinh --> dùng cho trang nhập điểm
const subjectScoreSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassDetail",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    term: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Term",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    scores: [
      {
        param: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Param",
        },
        value: {
          type: Number,
          required: true,
        },
      },
    ],
    avg: Number,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    editor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//điểm theo năm học của học sinh --> dùng cho trang tra cứu
const termScoreSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  term: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Term",
  },
  subjectScores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubjectScore",
    },
  ],
  avg: {
    type: Number,
    required: true,
  },
});

//Hệ số cột kiểm tra
const paramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: Number,
    required: true,
    unique: true,
  },
});

//Định nghĩa học kỳ
const termSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

//Định nghĩa năm học
// const schoolYearSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//   },
// });

//Dữ liệu chứa báo cáo một môn học
const subjectReportSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassDetail",
  },
  passed: {
    type: Number,
  },
  rate: {
    type: String,
  },
  term: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Term",
  },
  schoolYear: {
    type: String,
  },
});

//Dữ liệu chứa báo cáo một học kỳ
const termReportSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassDetail",
  },
  term: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Term",
  },
  schoolYear: {
    type: String,
  },
  passed: {
    type: Number,
  },
  rate: {
    type: String,
  },
});

const userSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["bgh", "gv", "pgv"],
  },
});

let Setting = mongoose.model("Setting", settingSchema);
let Student = mongoose.model("Student", studentSchema);
let Grade = mongoose.model("Grade", gradeSchema);
let ClassDetail = mongoose.model("ClassDetail", classDetailSchema);
let Class = mongoose.model("Class", classSchema);
let Subject = mongoose.model("Subject", subjectSchema);
let Param = mongoose.model("Param", paramSchema);
// let DetailScore = mongoose.model("DetailScore", detailScoreSchema);
let SubjectScore = mongoose.model("SubjectScore", subjectScoreSchema);
let TermScore = mongoose.model("TermScore", termScoreSchema);
let Term = mongoose.model("Term", termSchema);
// let SchoolYear = mongoose.model("SchoolYear", schoolYearSchema);
let SubjectReport = mongoose.model("subjectReport", subjectReportSchema);
let TermReport = mongoose.model("termReport", termReportSchema);
let User = mongoose.model("user", userSchema);
module.exports = {
  Setting,
  Student,
  Grade,
  Class,
  ClassDetail,
  Subject,
  // DetailScore,rs
  SubjectScore,
  TermScore,
  Param,
  Term,
  // SchoolYear,
  SubjectReport,
  TermReport,
  User,
};
