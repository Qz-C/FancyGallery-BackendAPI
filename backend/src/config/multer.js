const multer = require('multer');
const path = require("path")

module.exports = {
    dest: path.resolve(__dirname, "..", "..", "temp"),
    storage: multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "temp", `${req.email}`))
        },
        filename : (req, file, cb) => {
            const format = file.mimetype.split('/');
            const fileName  = `${file.fieldname}-${Date.now()}.${format[1]}`

            cb(null, fileName)
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif'
        ];

        if(allowedMimes.includes(file.mimetype)){
            cb(null, true);
        }else {
            cb(new Error("Invalid file type"));
        } 
    }
}