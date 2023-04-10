const router = require("express").Router();
const TermScoreController = require("../controller/termScoreController");

// ADD A SCHOOL_YEAR
router.post("/", TermScoreController.addTermScore);

//GET ALL SCHOOL_YEAR
router.get("/", TermScoreController.getAllTermScores);

//GET A SCHOOL_YEAR
router.get("/:id", TermScoreController.getTermScore);

//UPDATE A SCHOOL_YEAR
router.put("/:id", TermScoreController.updateTermScore);

//DELETE A SCHOOL_YEAR
router.delete("/:id", TermScoreController.deleteTermScore);

module.exports = router;
