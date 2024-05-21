const Book = require("../models/book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  if (bookObject.year > new Date().getFullYear()) {
    return res.status(401).json({ message: "Date incorrect" });
  }
  delete bookObject._id;
  const book = new Book({
    ...bookObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Objet non trouvé !" });
      }
      if (book.userId !== req.auth.userId) {
        return res.status(400).json({ message: "Unauthorized request" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.modifyOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((bookFound) => {
      if (!bookFound) {
        return res.status(404).json({ message: "Objet non trouvé " });
      }
      if (bookFound.userId !== req.auth.userId) {
        return res.status(400).json({ message: "Unauthorized request" });
      } else {
        const bookObject = req.file
          ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
            }
          : { ...req.body };
        delete bookObject._id;
        if (req.file) {
          const filename = bookFound.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (error) {
              console.log(
                "Erreur lors de la suppression de l'ancienne image:",
                error
              );
            }
            Book.updateOne(
              { _id: req.params.id },
              { ...bookObject, _id: req.params.id }
            )
              .then(() =>
                res.status(200).json({ message: "Livre modifié avec succès !" })
              )
              .catch((error) => res.status(400).json({ error }));
          });
        } else {
          Book.updateOne(
            { _id: req.params.id },
            { ...bookObject, _id: req.params.id }
          )
            .then(() =>
              res.status(200).json({ message: "Livre modifié avec succès !" })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.rateOneBook = (req, res, next) => {
  const userId = req.body.userId;
  const grade = req.body.rating;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId === req.auth.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const hasAlreadyRated = book.ratings.some(
        (rating) => rating.userId.toString() === userId
      );
      if (hasAlreadyRated) {
        return res
          .status(400)
          .json({ message: "L'utilisateur a déjà noté ce livre" });
      }

      book.ratings.push({ userId, grade });
      const totalGrade = book.ratings.reduce(
        (accumulator, currentValue) => accumulator + currentValue.grade,
        0
      );
      book.averageRating = totalGrade / book.ratings.length;

      book
        .save()
        .then(() => res.status(200).json(book))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllBook = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};
