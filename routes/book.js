const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const books = require("../controllers/book");

router.post("/", auth, multer, books.createBook);
router.get("/", books.getAll);

module.exports = router;
