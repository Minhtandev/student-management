const router = require("express").Router();
const GradeController = require("../controller/gradeController");

// ADD A SETTING
router.post("/", GradeController.addGrade);

//GET ALL SETTINGS
router.get("/", GradeController.getAllGrades);

//UPDATE A SETTING
router.put("/:id", GradeController.updateGrade);

//GET A SETTING
router.get("/:id", GradeController.getGrade);

//DELETE A SETTING
router.delete("/:id", GradeController.deleteGrade);

module.exports = router;
