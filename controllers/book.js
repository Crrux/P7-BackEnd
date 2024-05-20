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
        // Si le livre n'est pas trouvé, renvoie un statut 404.
        return res.status(404).json({ message: "Objet non trouvé !" });
      }
      // Vérifie si l'utilisateur qui fait la demande est le propriétaire du livre.
      if (book.userId !== req.auth.userId) {
        // Si non, renvoie un statut 400 pour une demande non autorisée.
        return res.status(400).json({ message: "Unauthorized request" });
      } else {
        // Extrait le nom du fichier de l'image à partir de l'URL.
        const filename = book.imageUrl.split("/images/")[1];
        // Supprime l'image du serveur.
        fs.unlink(`images/${filename}`, () => {
          // Supprime le livre de la base de données.
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => {
      // Gère les erreurs de recherche ou de connexion à la base de données.
      res.status(500).json({ error });
    });
};

exports.getAll = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOne = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};
