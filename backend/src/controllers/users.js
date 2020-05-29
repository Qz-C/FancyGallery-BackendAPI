const db = require('../db/connection');
const bcrypt = require('bcrypt');

db.connect()
    .then(res => console.log('Successful connected to database'))
    .catch(e => console.error(e.stack))

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
                return res.sendStatus(409);
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                await db.query( 'INSERT INTO users (name, email, password, created_at, updated_at) VALUES($1, $2, $3, $4, $5)',
                            [ name, email, hashedPassword, new Date(), new Date() ] );
                return res.sendStatus(201);
            }     
        }catch{
            return res.sendStatus(500);
        }
    },
}