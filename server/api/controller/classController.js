const { Class, Grade } = require("../models/model");

const ClassController = {
  //ADD ClassDetailLIST
  addClass: async (req, res) => {
    try {
      const newClass = new Class(req.body);
      // const grade = Grade.findByIdAndUpdate({id: req.params.grade}, {$push: {classes: }})
      const savedClass = await newClass.save();
      res.status(200).json(savedClass);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ALL ClassDetailLISTS
  getAllClass: async (req, res) => {
    try {
      const classes = await Class.find();
      res.status(200).json(classes);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //GET A ClassDetailLIST
  getAClass: async (req, res) => {
    try {
      const aClass = await Class.findById(req.params.id);
      res.status(200).json(aClass);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //UPDATE ClassDetailLIST
  updateClass: async (req, res) => {
    try {
      const updateClass = await Class.findById(req.params.id);
      await updateClass.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE ClassDetailLIST
  deleteClass: async (req, res) => {
    try {
      await Class.findByIdAndDelete(req.params.id);
      res.status(200).json("Deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = ClassController;
