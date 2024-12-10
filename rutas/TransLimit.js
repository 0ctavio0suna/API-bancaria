const { Router } = require('express');
const connect = require('../config/db');
const router = Router();

router.post('/check-limit', async (req, res) => {
    const { user_id, amount } = req.body;
    const db = await connect();
    const today = new Date().toISOString().split('T')[0];
    try {
        const query = 'SELECT * FROM transaction_limits WHERE user_id = ? AND date = ?';
        const [limit] = await db.execute(query, [user_id, today]);
        if (limit.length > 0 && limit[0].amount + amount > 1000) {
            return res.status(400).json({ error: 'Límite de transacción excedido' });
        } else {
            res.status(200).json({ message: 'Transacción permitida' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al verificar el límite' });
    }
});

module.exports = router;
