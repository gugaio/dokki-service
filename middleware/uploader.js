const multer = require('multer');

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const uploader = multer({ storage: storage, fileFilter: fileFilter });

module.exports= uploader;