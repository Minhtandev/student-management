const router = require("express").Router();
const ClassDetailController = require("../controller/ClassDetailController");

// ADD A CLASS
router.post("/", ClassDetailController.addClassDetail);

//GET ALL CLASSES
router.get("/", ClassDetailController.getAllClasses);

//GET A CLASS
router.get("/:id", ClassDetailController.getClass);

//UPDATE A CLASS
router.put("/:id", ClassDetailController.updateClass);

//DELETE A CLASS
router.delete("/:id", ClassDetailController.deleteClass);

module.exports = router;
