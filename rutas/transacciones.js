const { Router } = require('express');
const connect = require('../config/db');
const router = Router();

router.post('/transactions', async (req, res) => {
    const { user_id, from_account, to_account, amount, transaction_type } = req.body;
    const db = await connect();
    try {
        const query = 'INSERT INTO transactions (user_id, from_account, to_account, amount, transaction_type) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(query, [user_id, from_account, to_account, amount, transaction_type]);
        res.status(201).json({ transaction_id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear transacción' });
    }
});

router.get('/transactions/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const db = await connect();
    try {
        const query = 'SELECT * FROM transactions WHERE user_id = ?';
        const [transactions] = await db.execute(query, [user_id]);
        res.status(200).json({ transactions });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener transacciones' });
    }
});

module.exports = router;
