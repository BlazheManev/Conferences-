const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
    limits: {
        fileSize: 20000000
      }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20000000
    }
});

module.exports = upload;