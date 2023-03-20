const { Param } = require("../models/model");

const ParamController = {
  //POST COEFF
  addParam: async (req, res) => {
    try {
      const newCoEff = new Param(req.body);
      const savedCoEff = await newCoEff.save();
      res.status(200).json(savedCoEff);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ALL COEFFS
  getAllParams: async (req, res) => {
    try {
      const coEffs = await Param.find();
      res.status(200).json(coEffs);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //GET COEFF
  getParam: async (req, res) => {
    try {
      const coEff = await Param.findById(req.params.id);
      res.status(200).json(coEff);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //UPDATE COEFF
  updateParam: async (req, res) => {
    try {
      const coEff = await Param.findById(req.params.id);
      await coEff.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE A COEFF
  deleteParam: async (req, res) => {
    try {
      await Param.findByIdAndDelete(req.params.id);
      res.status(200).json("Deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = ParamController;
