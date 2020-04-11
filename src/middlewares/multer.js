const multer = require('multer');

//Storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tmp/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

//Limits settings
const limits = {
  files: 1,
  fileSize: 1024 * 1024 * 5, // Max. Size: 5 mb
};

//File filter settings
const fileFilter = (req, file, cb) => {
  const allowedMimetypes = ['image/jpg', 'image/jpeg', 'image/png'];
  if (!allowedMimetypes.includes(file.mimetype)) {
    return cb(new Error(`Only are allowed: ${allowedMimetypes}`), false);
  }
  cb(null, true);
};

//Midleware
const upload = multer({ storage, limits, fileFilter });

module.exports = upload;
