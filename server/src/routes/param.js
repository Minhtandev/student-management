const router = require("express").Router();
const ParamController = require("../controller/paramController");

// ADD A SETTING
router.post("/", ParamController.addParam);

//GET ALL SETTINGS
router.get("/", ParamController.getAllParams);

//UPDATE A SETTING
router.put("/:id", ParamController.updateParam);

//GET A SETTING
router.get("/:id", ParamController.getParam);

//DELETE A SETTING
router.delete("/:id", ParamController.deleteParam);

module.exports = router;
