const router = require("express").Router();
const SubjectController = require("../controller/subjectController");

// ADD A SUBJECT
router.post("/", SubjectController.addSubject);

//GET A SUBJECT
router.get("/:id", SubjectController.getSubject);

//GET ALL SUBJECTS
router.get("/", SubjectController.getAllSubjects);

//UPDATE A SUBJECT
router.put("/:id", SubjectController.updateSubject);

//DELETE A SUBJECT
router.delete("/:id", SubjectController.deleteSubject);

module.exports = router;
