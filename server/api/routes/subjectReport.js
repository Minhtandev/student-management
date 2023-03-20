const router = require("express").Router();
const SubjectReportController = require("../controller/subjectReportController");

// ADD A REPORTED_SUBJECT
router.post("/", SubjectReportController.addSubjectReport);

//GET ALL REPORTED_SUBJECT
router.get("/", SubjectReportController.getSubjectReports);

//GET A REPORTED_SUBJECT
router.get("/:id", SubjectReportController.getSubjectReport);

//PUT A REPORTED_SUBJECT
router.put("/:id", SubjectReportController.updateSubjectReport);

//DELETE A REPORTED_SUBJECT
router.delete("/:id", SubjectReportController.deleteSubjectReport);

module.exports = router;
