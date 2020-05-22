const multer = require("multer");

const MIME_TYPES = {
  "img/jpg": "jpg",
  "img/jpeg": "jpg",
  "img/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

module.exports = multer({storage: storage}).single("image");
