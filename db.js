const mysql = require('mysql2/promise');

async function connect() {
    try {
        const HOST = '178.128.158.184';
        const PORT = 3306;
        const USER = 'root';
        const PASSWORD = 't00r';
        const DATABASE = 'BANCA_MOVIL';

        const conn = await mysql.createConnection({
            'host': HOST,
            'port': PORT,
            'user': USER,
            'password': PASSWORD,
            'database': DATABASE
        });
        console.log('Conexión creada');
        return conn;

    } catch(err) {
        console.log('Ocurrió un error al intentar realizar la conexión: ' + err);
        throw err;
    }
}

module.exports = connect;