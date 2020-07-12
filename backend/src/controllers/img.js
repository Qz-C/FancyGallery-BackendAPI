const db = require('../db/connection');

module.exports = {
    async upload(req, res){
        console.log(req.file);

        return res.json({ "Hello": "world" })
    },
    async download(req, res){

    }
}