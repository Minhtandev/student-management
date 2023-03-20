const { TermReport } = require("../models/model");

const TermReportController = {
  //ADD REPORT_TERM
  addTermReport: async (req, res) => {
    try {
      const newReportedTerm = new TermReport(req.body);
      const savedReportedTerm = await newReportedTerm.save();
      res.status(200).json(savedReportedTerm);
    } catch (err) {
      res.status(500).json(err);
      console.log(req.body);
    }
  },

  // GET ALL REPORT_TERMS
  getTermReports: async (req, res) => {
    try {
      const reportedTerms = await TermReport.find();
      res.status(200).json(reportedTerms);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //GET A REPORT_TERM
  getTermReport: async (req, res) => {
    try {
      const reportedTerm = await TermReport.findById(req.params.id);
      res.status(200).json(schoolYear);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //UPDATE REPORT_TERM
  updateTermReport: async (req, res) => {
    try {
      const reportedTerm = await TermReport.findById(req.params.id);
      await reportedTerm.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE REPORT_TERM
  deleteTermReport: async (req, res) => {
    try {
      await TermReport.findByIdAndDelete(req.params.id);
      res.status(200).json("Deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = TermReportController;
