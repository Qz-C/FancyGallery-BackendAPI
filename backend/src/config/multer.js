const multer = require('multer');
const path = require("path")

module.exports = {
    dest: path.resolve(__dirname, "..", "..", "temp"),
    storage: multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "temp", `${req.email}`))
        },
        filename : (req, file, cd) => {

            const prefix = Date.now();

            const fileName  = `${prefix}-${file.originalname}`

            cd(null, fileName)
        }
    }),
    limits: {
        fileSize: 100 * 1024 * 1024,
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
            cd(new Error("Invalid file type"));
        } 
    }
}