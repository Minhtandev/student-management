const router = require("express").Router();
const ClassController = require("../controller/classController");

// ADD A CLASS
router.post("/", ClassController.addClass);

//GET ALL CLASSES
router.get("/", ClassController.getAllClass);

//GET A CLASS
router.get("/:id", ClassController.getAClass);

//UPDATE A CLASS
router.put("/:id", ClassController.updateClass);

//DELETE A CLASS
router.delete("/:id", ClassController.deleteClass);

module.exports = router;
