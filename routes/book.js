const express = require("express");
const router = express.Router();

const books = require("../controllers/book");


router.get("/", books.getAll);

module.exports = router;