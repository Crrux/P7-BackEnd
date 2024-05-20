const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const optimizeImg = require("../middleware/sharp-config");

const books = require("../controllers/book");

router.post("/", auth, multer, optimizeImg, books.createBook);
router.delete("/:id", auth, books.deleteBook);
router.get("/:id", books.getOne);
router.get("/", books.getAll);

module.exports = router;
