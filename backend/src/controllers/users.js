const db = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const e = require('express');
require('dotenv').config();

function genarateToken( params = {} ){
    return jwt.sign(params, process.env.SECRET_AUTH, {
        expiresIn: 604800,
    })
}

module.exports = {
    async create(req, res){
        try{
            const {
                name,
                email,
                password
            } = req.body;
            
            const emailValidation = await db.query(`SELECT email FROM users WHERE email = $1`, [email]);
        
            if(emailValidation.rowCount > 0)
                return res.status(409).send({error: 'Email already used'});
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await db.query( 'INSERT INTO users (name, email, password, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING *',
                            [ name, email, hashedPassword, new Date(), new Date() ] );
                
                user.rows[0].password = undefined;
                fs.mkdirSync(`temp/${email}`);
                return res.status(201).send({
                    user: user.rows[0],
                    token: genarateToken({email: email}),
                });
        }

        }catch{
            return res.status(500).send("An unexpected error ocorred");
        }
    },

    async session( req, res ) {
        const { email, password } = req.body;

        const user = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        
        if(user.rowCount === 0)
            return res.status(400).send({error: "User not found"});

        const hashedPassword = user.rows[0].password;
        user.rows[0].password = undefined;

        if ( ! await bcrypt.compare(password, hashedPassword) ) 
            return res.status(401).send({error: "Invalid password"});

        return res.status(201).send({
            user: user.rows[0], 
            token: genarateToken({email: email})
        });
    },

    async updateName (req, res) {
        
        const { name } = req.body;
        try{
            const user = await db.query('UPDATE users SET name = $1, updated_at = $2 WHERE email = $3 RETURNING *',
                                        [name , new Date() , req.email]);
            user.rows[0].password = undefined;
            return res.status(201).send({user:user.rows[0]});
        }catch (err) {
            return res.status(500).send({error: 'something goes wrong, please try again later'});}
    },

    async updatePassword (req, res) {
        
        const { password } = req.body;

        hashedPassword =  await bcrypt.hash(password, 10);

        try{
            const user = await db.query('UPDATE users SET password = $1, updated_at = $2 WHERE email = $3 RETURNING *',
                                        [hashedPassword , new Date() , req.email]);
            user.rows[0].password = undefined;
            return res.status(201).send({user:user.rows[0]});
        }catch (err) {
            return res.status(500).send({error: 'something goes wrong, please try again later'});}
    },

    async delete (req, res) {
        try{
            await db.query('DELETE from users WHERE email = $1', [req.email]);
            fs.rmdirSync(`temp/${req.email}`);
            return res.status(200).send({ message: "User successful deleted" });
        
        }catch (err){

            return res.status(500).send({error: 'something goes wrong, please try again later'});
        }
    },
}