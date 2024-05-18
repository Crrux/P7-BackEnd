const book = require("../models/book");

exports.getAll = (req, res, next) => {
    res.status(200).json({ message: "oui" })
}