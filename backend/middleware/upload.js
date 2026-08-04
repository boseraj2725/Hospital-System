const multer = require("multer");
const path = require("path");


// Storage Configuration
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/profile");

    },


    filename: function (req, file, cb) {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});


// File Filter

const fileFilter = (req, file, cb) => {


    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp"
    ];


    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    }
    else {

        cb(
            new Error("Only image files allowed"),
            false
        );

    }

};



// Multer Upload

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 2 * 1024 * 1024
    }

});


module.exports = upload;