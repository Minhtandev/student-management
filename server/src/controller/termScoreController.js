const { TermScore } = require("../models/model");

const TermScoreController = {
  //ADD SCORE_SCHOOL_YEAR
  addTermScore: async (req, res) => {
    try {
      const newScoreSchoolYear = new TermScore(req.body);
      const savedScoreSchoolYear = await newScoreSchoolYear.save();
      res.status(200).json(savedScoreSchoolYear);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ALL SCORE_SCHOOL_YEARS
  getAllTermScores: async (req, res) => {
    try {
      const scoreSheets = await TermScore.find();
      res.status(200).json(scoreSheets);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //GET A SCORE_SCHOOL_YEAR
  getTermScore: async (req, res) => {
    try {
      const scoreSchoolYear = await TermScore.findById(req.params.id);
      res.status(200).json(scoreSchoolYear);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //UPDATE SCORE_SCHOOL_YEAR
  updateTermScore: async (req, res) => {
    try {
      const scoreSchoolYear = await TermScore.findById(req.params.id);
      await scoreSchoolYear.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE SCORE_SCHOOL_YEAR
  deleteTermScore: async (req, res) => {
    try {
      await TermScore.findByIdAndDelete(req.params.id);
      res.status(200).json("Deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = TermScoreController;
