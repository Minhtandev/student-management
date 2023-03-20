const { Student, ClassDetail, Subject } = require("../models/model");

const StudentController = {
  //ADD STUDENT
  addStudent: async (req, res) => {
    try {
      const newStudent = new Student(req.body);
      const savedStudent = await newStudent.save();
      // if (req.body.ClassDetail) {
      //   const ClassDetail = ClassDetail.findById(req.body.ClassDetail);
      //   await ClassDetail.updateOne({ $push: { students: savedStudent._id } });
      // }
      res.status(200).json(savedStudent);
    } catch (err) {
      res.status(500).json(err);
      console.log(err.body);
    }
  },

  // GET ALL STUDENTS
  getAllStudents: async (req, res) => {
    try {
      const students = await Student.find();
      res.status(200).json(students);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //GET A STUDENT
  getStudent: async (req, res) => {
    try {
      const student = await Student.findById(req.params.id).populate(
        "ClassDetail"
      );
      // .populate("subjects");
      res.status(200).json(student);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //UPDATE A STUDENT
  updateStudent: async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      // if (req.body.ClassDetail && !student.ClassDetail) {
      //   // const author = Author.find({ _id: req.body.author });
      //   const ClassDetail = ClassDetail.findById(req.body.ClassDetail);
      //   await ClassDetail.updateOne({ $push: { students: student._id } });
      // }
      await student.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE A STUDENT
  deleteStudent: async (req, res) => {
    try {
      await ClassDetail.updateMany(
        { students: req.params.id },
        { $pull: { students: req.params.id } }
      );
      // await Subject.updateMany(
      //   { students: req.params.id },
      //   { $pull: { students: req.params.id } }
      // );
      await Student.findByIdAndDelete(req.params.id);
      res.status(200).json("Deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = StudentController;
