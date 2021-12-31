// Conexión con MySQL
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'iw',
    database: 'clinicaiw',
    password: 'password',
    multipleStatements: true
});

module.exports = { connection };