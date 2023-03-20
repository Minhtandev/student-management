const router = require("express").Router();
const SubjectScoreController = require("../controller/subjectScoreController");

// ADD A SCHOOL_YEAR
router.post("/", SubjectScoreController.addScoreSubject);

//GET ALL SCHOOL_YEAR
router.get("/", SubjectScoreController.getAllScoreSubjects);

//GET A SCHOOL_YEAR
router.get("/:id", SubjectScoreController.getScoreSubject);

//UPDATE A SCHOOL_YEAR
router.put("/:id", SubjectScoreController.updateScoreSubject);

//DELETE A SCHOOL_YEAR
router.delete("/:id", SubjectScoreController.deleteScoreSubject);

module.exports = router;
