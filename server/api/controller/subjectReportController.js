const { SubjectReport } = require("../models/model");

const SubjectReportController = {
  //ADD REPORTED_SUBJECT
  addSubjectReport: async (req, res) => {
    try {
      const newReportedSubject = new SubjectReport(req.body);
      const savedReportedSubject = await newReportedSubject.save();
      res.status(200).json(savedReportedSubject);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ALL REPORTED_SUBJECTS
  getSubjectReports: async (req, res) => {
    try {
      const reportedSubjects = await SubjectReport.find();
      res.status(200).json(reportedSubjects);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //GET A REPORTED_SUBJECT
  getSubjectReport: async (req, res) => {
    try {
      const reportedSubject = await SubjectReport.findById(req.params.id);
      res.status(200).json(reportedSubject);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //UPDATE A REPORTED_SUBJECT
  updateSubjectReport: async (req, res) => {
    try {
      const reportedSubject = await SubjectReport.findById(req.params.id);
      await reportedSubject.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE REPORTED_SUBJECT
  deleteSubjectReport: async (req, res) => {
    console.log("delete");

    try {
      await SubjectReport.findByIdAndDelete(req.params.id);
      res.status(200).json("Deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = SubjectReportController;
