const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function connect() {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log('Conexión a la base de datos establecida');
        return conn;
    } catch (err) {
        console.error('Error de conexión: ' + err);
        throw err;
    }
}

async function insertUser() {
    const db = await connect();
    
    const name = 'Carlos';
    const lastName = 'Hernández';
    const email = 'carlos.hernandez@example.com';
    const password = 'mysecurepassword'; // contraseña en texto claro

    // Cifrar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = 'INSERT INTO users (name, lastName, email, password) VALUES (?, ?, ?, ?)';
    await db.execute(query, [name, lastName, email, hashedPassword]);

    console.log('Usuario insertado correctamente');
}

insertUser().catch(err => console.error(err));