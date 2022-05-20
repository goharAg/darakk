const multer = require('multer');
const responseHandler = require('../helpers/responseHandler');

const storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    cb(null, Math.random().toString(36).substring(7).concat('.jpeg'));
  },
});

const imageFilter = function (req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(responseHandler.getUnexpectedFileType('File is not image type'));
  }
};

function uploadImage(req, res, next) {
  const upload = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 2 * 1024 * 1024, files: 1 }, //2 * 1024 * 1024
  }).single('profile-picture');
  upload(req, res, function (err) {
    if (err) {
      return responseHandler.errorResponse(err, res);
    }
    next();
  });
}

module.exports = { name: 'upload', uploadImage };
