const router = require("express").Router();
const classDetailController = require("../controller/classDetailController.js");

// ADD A CLASS
router.post("/", classDetailController.addClassDetail);

//GET ALL CLASSES
router.get("/", classDetailController.getAllClasses);

//GET A CLASS
router.get("/:id", classDetailController.getClass);

//UPDATE A CLASS
router.put("/:id", classDetailController.updateClass);

//DELETE A CLASS
router.delete("/:id", classDetailController.deleteClass);

module.exports = router;
