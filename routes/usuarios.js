const { Router } = require('express');
const connect = require('../config/db');
const bcrypt = require('bcrypt');
const router = Router();
const authVerify = require('../middleware/authVerify');

router.post('/register', async (req, res) => {
    let db;
    try {
        const { FirstName, LastName, Email, Password } = req.body;
        console.log("variables: ",FirstName, LastName, Email, Password)
        const hashedPassword = await bcrypt.hash(Password, 10);
        db = await connect()
        const query = 'INSERT INTO Users (FirstName, LastName, Email, Password) VALUES (?, ?, ?, ?)';

        db.query(query, [FirstName, LastName, Email, hashedPassword], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al registrar el usuario' });
            }
            res.status(200).json({ message: 'Usuario registrado correctamente' });
            console.log("Se registro el usuario")
        });
    } catch (error) {
        console.error('Error al encriptar la contraseña:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


router.post('/login', (req, res) => {
    const { Email, Password } = req.body;

    const query = 'SELECT * FROM Users WHERE Email = ?';
    db.query(query, [Email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al intentar iniciar sesión' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Correo no encontrado' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(Password, user.Password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso', user });
    });
});


router.post('/transactions', (req, res) => {
    const { SenderID, ReceiverID, Amount } = req.body;

    const query = 'INSERT INTO Transactions (SenderID, ReceiverID, Amount) VALUES (?, ?, ?)';
    db.query(query, [SenderID, ReceiverID, Amount], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al registrar la transacción' });
        }
        res.status(200).json({ message: 'Transacción registrada exitosamente' });
    });
});


router.get('/transactions/:userID', (req, res) => {
    const { userID } = req.params;

    const query = `
      SELECT * FROM Transactions 
      WHERE SenderID = ? OR ReceiverID = ?
    `;
    db.query(query, [userID, userID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al obtener transacciones' });
        }
        res.status(200).json({ transactions: results });
    });
});


router.post('/generate-qr', async (req, res) => {
    const { Amount, SenderID, ReceiverID } = req.body;

    const transactionData = { Amount, SenderID, ReceiverID };
    const qrString = JSON.stringify(transactionData);

    try {
        const qrCode = await QRCode.toDataURL(qrString);
        res.status(200).json({ qrCode });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al generar el código QR' });
    }
});












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
    } catch (err) {
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
        })
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
        })
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
