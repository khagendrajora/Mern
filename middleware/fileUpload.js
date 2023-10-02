const multer = require('multer')
// Inbuilt modules
const fs = require('fs')
// fs is used to read the folder and file
const path = require('path')
// path is used to read the filename and extension
//both path and fs are inbuild methods of nodejs which are used to work with files or images

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let fileDestination = 'public/uploads/'
        // Check if directory exists
        if (!fs.existsSync(fileDestination)) {
            fs.mkdirSync(fileDestination, { recursive: true }) // Recursive is to make parent and child directory
            cb(null, fileDestination)
        }
        else {
            cb(null, fileDestination)
        }
    },
    filename: function (req, file, cb) {
        let filename = path.basename(file.originalname, path.extname(file.originalname))
        // path.basename('downloads/abc.jpg' '.jpg')
        // returns abc
        let ext = path.extname(file.originalname)
        // returns .jpg
        cb(null, filename + '_' + Date.now() + ext)
        // abc_234567.jpg
    }
})

const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|png|jpeg|webp|jfif|gif|svg|JPG|PNG|JPEG|WEBP|JFIF|GIF|SVG)$/)) {
        return cb(new Error('You can upload image file only'), false)
    }
    else {
        cb(null, true)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 2000000 // 2mb
    }
})

module.exports = upload

  //install multer