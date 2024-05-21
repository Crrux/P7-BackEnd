const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const optimizeImg = require("../middleware/sharp-config");

const books = require("../controllers/book");

router.post("/", auth, multer, optimizeImg, books.createBook);
router.delete("/:id", auth, books.deleteBook);
router.put("/:id", auth, multer, optimizeImg, books.modifyOneBook);
router.post("/:id/rating", auth, books.rateOneBook);
router.get("/:id", books.getOneBook);
router.get("/", books.getAllBook);

module.exports = router;
