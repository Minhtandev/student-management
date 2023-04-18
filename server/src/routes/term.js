const router = require("express").Router();
const TermController = require("../controller/termController");

// ADD A TERM
router.post("/", TermController.addTerm);

//GET A TERM
router.get("/:id", TermController.getTerm);

//GET ALL TERMS
router.get("/", TermController.getAllTerms);

//UPDATE A TERM
router.put("/:id", TermController.updateTerm);

//DELETE A TERM
router.delete("/:id", TermController.deleteTerm);

module.exports = router;
