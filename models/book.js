const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const bookSchema = mongoose.Schema({
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    rating: { type: Number, required: true },
    imageUrl: { type: String, required: true },
});

bookSchema.plugin(uniqueValidator);

module.exports = mongoose.model("book", bookSchema);
