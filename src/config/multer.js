const multer = require("multer");
const path = require("path")
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const storageTypes = {
    local: multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "temp", `${req.email}`))
        },
        filename : (req, file, cb) => {
            const format = file.mimetype.split('/');
            file.key  = `${file.fieldname}-${Date.now()}.${format[1]}`

            cb(null, file.key);
        }
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'fancy-gallery',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            const format = file.mimetype.split('/');
            const fileName  = `${file.fieldname}-${Date.now()}.${format[1]}`

            cb(null, fileName)
        } 
    })
}



module.exports = {

    storage: storageTypes["s3"] ,
    limits: {
        fileSize: 40 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif',
        ];

        if(allowedMimes.includes(file.mimetype)){
            cb(null, true);
        }else {
            cb(new Error("Invalid file type"));
        } 
    }
}