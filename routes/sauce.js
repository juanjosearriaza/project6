const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer-config");
const sauceCtrl = require("../controller/sauce");
const auth = require("../middleware/auth");



router.get("/", auth, sauceCtrl.getSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifyOneSauce);
router.delete("/:id", auth, sauceCtrl.deleteOneSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce)

module.exports = router;
