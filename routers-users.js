const express = require('express');
const bcrypt = require('bcrypt');
const connect = require('../config/db'); 
const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, lastName, email, password } = req.body;

    try {
        const db = await connect();
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = 'INSERT INTO users (name, lastName, email, password) VALUES (?, ?, ?, ?)';
        await db.execute(query, [name, lastName, email, hashedPassword]);

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            email: email
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});

module.exports = router;
