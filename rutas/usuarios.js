const { Router } = require('express');
const connect = require('../config/db');
const bcrypt = require('bcrypt');
const router = Router();
const authVerify = require('../middleware/authVerify');

router.get('/users', authVerify, async (req, res) => {
    let db;
    try {
        db = await connect();
        const query = 'SELECT * FROM usuarios';
        const [row] = await db.execute(query);
        console.log(row);
        res.status(200).json({
            'data': row
        });
    } catch(err) {
        console.log(err);
    }
});

router.post('/users', async (req, res) => {
    let db;
    try {
        const { email, nombre, password } = req.body;
        const saltRound = 10;
        db = await connect();
        const hashPassword = await bcrypt.hash(password, saltRound);
        console.log(hashPassword);
        const query = `INSERT INTO usuarios(nombre, email, password) VALUES('${nombre}', '${email}', '${hashPassword}')`;
        const [row] = await db.execute(query);
        res.status(201).json({
            'data': row
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'msg': 'Ocurrió un error al intentar almacenar los datos del usuario'
        });
    }
});

router.get('/users/:email', authVerify, async (req, res) => {
    const email = req.params.email;
    let db;
    try {
        db = await connect();
        console.log(email);
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        const [row] = await db.execute(query, [email]);
        console.log(row);
        res.status(200).json({
            'data': row
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'msg': 'Ocurrió un error al intentar obtener los datos del usuario'
        });
    }
});

router.delete('/users/:email', authVerify, async (req, res) => {
    const email = req.params.email;
    console.log(req.email_usuario);
    let db;
    try {
        db = await connect();
        const query = 'DELETE FROM usuarios WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        if (rows.affectedRows === 0) {
            res.json({
                'users': [],
                'status': 404,
                'msg': 'Email no encontrado',
            });
        } else {
            res.json({
                'status': 200,
                'users': []
            });
        }
    } catch (err) {
        console.log(err);
    }
});

router.put('/users/:email', authVerify, async (req, res) => {
    const email = req.params.email;
    const { nombre } = req.body;

    try {
        db = await connect();
        const query = 'UPDATE usuarios SET nombre = ? WHERE email = ?';
        const [rows] = await db.execute(query, [nombre, email]);
        if (rows.affectedRows === 0) {
            res.json({
                'users': [],
                'status': 404,
                'msg': 'Email no encontrado',
            });
        } else {
            res.json({
                'status': 200,
                'users': []
            });
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;