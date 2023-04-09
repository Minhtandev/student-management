const { User } = require("../models/model");

const userController = {
  //ADD TERM
  addUser: async (req, res) => {
    try {
      const newTerm = new User(req.body);
      const savedTerm = await newTerm.save();
      res.status(200).json(savedTerm);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ALL TERMS
  getAllUsers: async (req, res) => {
    try {
      const terms = await User.find();
      res.status(200).json(terms);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //GET A TERM
  getUser: async (req, res) => {
    try {
      const term = await User.findById(req.params.id);
      res.status(200).json(term);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //UPDATE A TERM
  updateUser: async (req, res) => {
    try {
      const term = await User.findById(req.params.id);
      await term.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE A TERM
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
