const db = require('../db/connection');
const fs = require('fs');
const path = require('path');

module.exports = {
    async upload(req, res){

        const {
            destination,
            filename,
            size,
            mimetype
        } = req.file;
        
        try{
            const email = req.email;

            const format = (mimetype.split('/'))[1]

            const user = ( await db.query(`SELECT * FROM users WHERE email = $1`, [email])).rows[0]
            
            const img = (await db.query(`INSERT INTO photos (url, name, size, format, users_email, users_id, created_at, updated_at) VALUES( $1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
                     [destination, filename, size, format, user.email, user.id, new Date(), new Date()])).rows[0];
        
            return res.status(201).send(img)
        }catch(e){
            console.error(e)
            res.status(500).send({error: 'something goes wrong, please try again later'})
        }
    },

    async updateName(req, res){

        const id = req.query.id
        const tempName = req.body.name
        const email = req.email

        try{

            const {name: oldName , format} = (await db.query('SELECT * FROM photos WHERE users_email = $1 AND id = $2', 
                                            [email, id])).rows[0];

            const NewName = `${tempName}.${format}`

            if ( (await db.query(`SELECT * FROM photos WHERE name = $1 AND id != $2`, [NewName, id])).rowCount > 0 )
                return res.status(409).send({error : "Nome already in use"})
            
            const img = (await db.query('UPDATE photos SET name = $1, updated_at = $2 WHERE users_email = $3 AND id = $4 RETURNING *',
                                        [NewName , new Date() , email, id])).rows[0];

            try{
                fs.renameSync(`temp/${email}/${oldName}`, `temp/${email}/${NewName}`)
            }catch (e) {
                console.error(e)
            }

            return res.status(201).send(img);

        }catch {
            return res.status(500).send({error: 'something goes wrong, please try again later'});
        }
    },
    async delete(req, res){

        const id = req.query.id;
        const email = req.email;

        try{

            const { name } = (await db.query('SELECT * FROM photos WHERE users_email = $1 AND id = $2', 
                            [email, id])).rows[0];
                        
            fs.unlinkSync(`temp/${email}/${name}`)

            await db.query('DELETE from photos WHERE users_email = $1 AND id = $2', 
                            [email, id]);
            
            return res.status(200).send({ message: "Image successful deleted" });
        }catch (e){
            console.error(e)
            return res.status(500).send({error: 'something goes wrong, please try again later'});
        }
    },

    async list (req, res){

        const email = req.email;

        try{
            const imgs = (await db.query('SELECT * FROM photos WHERE users_email = $1', 
                            [email])).rows;
            if(imgs.length === 0)
                res.status(200).send({message : "There is mo image uploaded to this account"});
            else
                res.status(200).send(imgs);
        }catch(e){
            console.error(e)
            return res.status(500).send({error: 'something goes wrong, please try again later'});
        }
    },

    async download (req, res){

        const id = req.query.id;
        const email = req.email;

        const { url:path, name } = (await db.query(`SELECT * FROM photos WHERE users_email = $1 AND id = $2`,
                                [email , id])).rows[0]
        
        return res.download(`temp/${email}/${name}`, function (err) {
            if (!err)
                return
            else{
                console.log(err)
            }
        })
    }

}