const { Pool } = require('pg');
require('dotenv').config();

const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

db.connect()
    .then(res => console.log('Successful connected to database'))
    .catch(e => console.error(e.stack))

module.exports = db;