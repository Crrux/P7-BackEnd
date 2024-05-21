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
      .toFile(optimizedImagePath)
      .then(() => {
        req.file.path = optimizedImagePath;
        req.file.filename = optimizedImageName;
        // Supprimer l'image originale
        fs.unlink(originalImagePath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("Original image deleted successfully");
        });
      });
    next();
  } catch (err) {
    console.error(err);
  }
};

module.exports = optimizeImg;
