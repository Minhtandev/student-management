const router = require("express").Router();
const SettingController = require("../controller/settingController");

// ADD A SETTING
router.post("/", SettingController.addSetting);

//GET ALL SETTINGS
router.get("/", SettingController.getAllSettings);

//UPDATE A SETTING
router.put("/:id", SettingController.updateSetting);

//GET A SETTING
router.get("/:id", SettingController.getSetting);

//DELETE A SETTING
router.delete("/:id", SettingController.deleteSetting);

module.exports = router;
