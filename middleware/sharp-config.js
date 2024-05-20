const sharp = require("sharp");
const fs = require("fs");

const optimizeImg = async (req, res, next) => {
  if (!req.file) return next();
  const originalImagePath = req.file.path;
  const optimizedImageName = `optimized_${req.file.filename}`;
  const optimizedImagePath = `images/${optimizedImageName}`;
  try {
    await sharp(originalImagePath)
      .webp({ quality: 80 })
      .resize(400)
      .toFile(optimizedImagePath);

    req.file.path = optimizedImagePath;
    req.file.filename = optimizedImageName;

    fs.unlink(originalImagePath, (error) => {
      if (error) {
        console.error("Impossible de supprimer l'image originale : ", error);
      }
    });
  } catch (error) {
    console.error("Impossible d'optimiser l'image : ", error);
    res.status(500).json({ message: "Impossible d'optimiser l'image" });
  }
};

module.exports = optimizeImg;
