const { Pool } = require('pg');

const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'fancygallery',
    password: '123456',
    port: 5432,
});

db.connect()
    .then(res => console.log('Successful connected to database'))
    .catch(e => console.error(e.stack))

module.exports = db;