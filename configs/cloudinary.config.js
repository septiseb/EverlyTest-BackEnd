const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer = require('multer');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'everlytest', // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png'],
  params: { resource_type: 'raw' },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // The file on cloudinary would have the same name as the original file name
  }
});

module.exports= multer({storage})
