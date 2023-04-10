const router = require("express").Router();
const TermReportController = require("../controller/termReportController");

// ADD A  REPORTED_TERM
router.post("/", TermReportController.addTermReport);

//GET ALL  REPORTED_TERM
router.get("/", TermReportController.getTermReports);

//GET A  REPORTED_TERM
router.get("/:id", TermReportController.getTermReport);

//UPDATE A REPORTED_TERM
router.put("/:id", TermReportController.updateTermReport);

//DELETE A REPORTED_TERM
router.delete("/:id", TermReportController.deleteTermReport);

module.exports = router;
