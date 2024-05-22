const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const optimizeImg = async (req, res, next) => {
  if (!req.file) return next();
  const originalImagePath = req.file.path;
  const filename = originalImagePath.split("images\\")[1];
  console.log(filename);
  const optimizedImageName = `${path.basename(
    originalImagePath,
    path.extname(originalImagePath)
  )}.webp`;
  const optimizedImagePath = path.join(
    path.dirname(originalImagePath),
    optimizedImageName
  );

  sharp(originalImagePath)
    .webp({ quality: 80 })
    .resize(400)
    .toFile(optimizedImagePath, (error, info) => {
      if (error) {
        console.error(error);
        return;
      }

      console.log(info);

      fs.unlink(`images/${filename}`, (unlinkErr) => {
        if (unlinkErr) {
          console.error(unlinkErr);
        } else {
          console.log("\nDeleted Image: ", originalImagePath);
        }
      });
      req.file.path = optimizedImagePath;
      req.file.filename = optimizedImageName;
      console.log(req.file.path);
      console.log(originalImagePath); // undefined
      next();
    });
};

module.exports = optimizeImg;
