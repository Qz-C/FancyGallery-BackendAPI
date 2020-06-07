const db = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json')

db.connect()
    .then(res => console.log('Successful connected to database'))
    .catch(e => console.error(e.stack))

function genarateToken( params = {} ){
    return jwt.sign(params, authConfig.secret, {
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
                return res.status(201).send({
                    user: user.rows[0],
                    token: genarateToken({email: email}),
                });
        }

        }catch{
            return res.sendStatus(500);
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
            return res.status(400).send({error: "Invalid password"});

        return res.status(201).send({
            user: user.rows[0], 
            token: genarateToken({email: email})
        });
    },

}