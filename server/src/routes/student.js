const router = require("express").Router();
const StudentController = require("../controller/studentController");

// ADD A STUDENT
router.post("/", StudentController.addStudent);

//GET A STUDENT
router.get("/:id", StudentController.getStudent);

//GET ALL STUDENT
router.get("/", StudentController.getAllStudents);

//UPDATE A STUDENT
router.put("/:id", StudentController.updateStudent);

//DELETE A STUDENT
router.delete("/:id", StudentController.deleteStudent);

module.exports = router;
