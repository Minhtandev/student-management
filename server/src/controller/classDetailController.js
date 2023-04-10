const { Student, ClassDetail, Grade } = require("../models/model");

const classDetailController = {
  //ADD CLASS
  addClassDetail: async (req, res) => {
    try {
      const newClass = new ClassDetail(req.body);
      const savedClass = await newClass.save();
      // if (req.body.grade) {
      //   const grade = Grade.findById(req.body.grade);
      //   await grade.updateOne({ $push: { ClassDetailes: savedClass._id } });
      // }
      res.status(200).json(savedClass);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ALL CLASSES
  getAllClasses: async (req, res) => {
    try {
      const classes = await ClassDetail.find();
      res.status(200).json(classes);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //GET A CLASS
  getClass: async (req, res) => {
    try {
      const classDetail = await ClassDetail.findById(req.params.id);
      // .populate("students")
      // .populate("grade");
      res.status(200).json(classDetail);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //UPDATE A CLASS
  updateClass: async (req, res) => {
    try {
      const classDetail = await ClassDetail.findById(req.params.id);
      // if (req.body.students) {
      //   for (let i = 0; i < req.body.students.length; i++) {
      //     await Student.updateOne({ $push: { classes: req.params.id } });
      //   }
      // }
      await classDetail.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE A CLASS
  deleteClass: async (req, res) => {
    try {
      // await Grade.updateMany(
      //   { ClassDetailes: req.params.id },
      //   { $pull: { ClassDetailes: req.params.id } }
      // );
      await Student.updateMany(
        { classes: req.params.id },
        { $pull: { classes: req.params.id } }
      );
      await ClassDetail.findByIdAndDelete(req.params.id);
      res.status(200).json("Deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = classDetailController;
