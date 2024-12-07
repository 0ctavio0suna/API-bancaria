const { Router } = require('express');
const connect = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = Router();

router.post('/auth/login', async (req, res) => {
    let db;
    try {
        const { email, password } = req.body;
        db = await connect();
        
        const query = `SELECT * FROM usuarios WHERE email = "${email}"`;
        const [row] = await db.execute(query);

        if (row.length === 1) {
            const hashPassword = row[0].password;
            if (await bcrypt.compare(password, hashPassword)) {
                const token = jwt.sign({ email: email }, 'secret', {
                    expiresIn: '1h'
                });
                res.json({
                    status: 200,
                    token: token
                });
            } else {
                res.json({
                    status: 400,
                    token: null
                });
            }
        } else {
            res.status(404).json({ status: 404, error: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, error: 'Error interno del servidor' });
    }
});

module.exports = router;
