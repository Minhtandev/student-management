const router = require("express").Router();
const userController = require("../controller/userController");

// ADD A TERM
router.post("/", userController.addUser);

//GET A TERM
router.get("/:id", userController.getUser);

//GET ALL TERMS
router.get("/", userController.getAllUsers);

//UPDATE A TERM
router.put("/:id", userController.updateUser);

//DELETE A TERM
router.delete("/:id", userController.deleteUser);

module.exports = router;
