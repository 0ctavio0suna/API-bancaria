const { Router } = require('express');
const connect = require('../config/db');
const router = Router();
const authVerify = require('../middleware/authVerify');


router.post('/accounts', async (req, res) => {
    const { user_id, account_type } = req.body;
    let db;
    try {
        db = await connect();
        const query = 'INSERT INTO accounts (user_id, account_type) VALUES (?, ?)';
        const [result] = await db.execute(query, [user_id, account_type]);
        res.status(201).json({
            'data': {
                'account_id': result.insertId,
                'user_id': user_id,
                'account_type': account_type
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'msg': 'Error al crear la cuenta bancaria' });
    }
});


router.get('/accounts/:user_id', async (req, res) => {
    const { user_id } = req.params;
    let db;
    try {
        db = await connect();
        const query = 'SELECT * FROM accounts WHERE user_id = ?';
        const [accounts] = await db.execute(query, [user_id]);
        res.status(200).json({ 'data': accounts });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'msg': 'Error al obtener las cuentas bancarias' });
    }
});


router.get('/accounts/:user_id/:account_id', async (req, res) => {
    const { user_id, account_id } = req.params;
    let db;
    try {
        db = await connect();
        const query = 'SELECT * FROM accounts WHERE user_id = ? AND id = ?';
        const [account] = await db.execute(query, [user_id, account_id]);
        if (account.length > 0) {
            res.status(200).json({ 'data': account[0] });
        } else {
            res.status(404).json({ 'msg': 'Cuenta no encontrada' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'msg': 'Error al obtener la cuenta bancaria' });
    }
});


router.put('/accounts/:user_id/:account_id', async (req, res) => {
    const { user_id, account_id } = req.params;
    const { account_type } = req.body;
    let db;
    try {
        db = await connect();
        const query = 'UPDATE accounts SET account_type = ? WHERE user_id = ? AND id = ?';
        const [result] = await db.execute(query, [account_type, user_id, account_id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ 'msg': 'Cuenta actualizada correctamente' });
        } else {
            res.status(404).json({ 'msg': 'Cuenta no encontrada' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'msg': 'Error al actualizar la cuenta bancaria' });
    }
});


router.delete('/accounts/:user_id/:account_id', async (req, res) => {
    const { user_id, account_id } = req.params;
    let db;
    try {
        db = await connect();
        const query = 'DELETE FROM accounts WHERE user_id = ? AND id = ?';
        const [result] = await db.execute(query, [user_id, account_id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ 'msg': 'Cuenta eliminada correctamente' });
        } else {
            res.status(404).json({ 'msg': 'Cuenta no encontrada' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'msg': 'Error al eliminar la cuenta bancaria' });
    }
});

module.exports = router;
