const express = require('express');
const app = express();
const connect = require('./db');
const bodyParser = require('body-parser');
const PORT = 3001;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/users', async (req, res) =>{
    let db;
    try {
        db = await connect();
        const query = 'SELECT * FROM usuarios';
        const [row] = await db.execute(query);
        console.log(row);
        res.json({
            'status': 200,
            'users': row
        });
    } catch(err) {
        console.log(err);
    }
});

app.post('/users', async(req, res) => {
    let db;
    try {
        const {email, nombre} = req.body;
    
        db = await connect();
        const query = `INSERT INTO usuarios(nombre, email) VALUES('${nombre}', '${email}')`;
        const [row] = await db.execute(query);
        console.log(row);
        res.json({
            'status': 200,
            'users': row
        });
    } catch(err) {
        console.log(err);
    }
});

app.get('/users/:email', async (req, res) => {
    const email = req.params.email;
    let db;
    try {
        db = await connect();
        console.log(email);
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        const [row] = await db.execute(query, [email]);
        console.log(row);
        res.json({
            'status': 200,
            'users': row
        });
    } catch(err) {
        console.log(err);
    }
});

app.delete('/users/:email', async (req, res) => {
    const email = req.params.email;
    let db;
    try {
        db = await connect();
        console.log(email);
        const query = 'DELETE FROM usuarios WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        if(rows.affectedRows === 0) {
            res.json({
                'users': [],
                'status': 404,
                'msg': 'Email no encontrado',
            });
        } else {
            res.json({
                'status': 200,
                'users':[]
            });
        }
    } catch(err) {
        console.log(err);
    }
});

app.put('/users/:email', async (req, res) => {
    const email = req.params.email;
    const {nombre} = req.body;

    try {
        db = await connect();
        const query = 'UPDATE usuarios SET nombre = ? WHERE email = ?';
        const [rows] = await db.execute(query, [nombre, email]);
        if(rows.affectedRows === 0) {
            res.json({
                'users': [],
                'status': 404,
                'msg': 'Email no encontrado',
            });
        } else {
            res.json({
                'status': 200,
                'users':[]
            });
        }
    } catch(err) {
        console.log(err);
    }
});

app.listen(PORT, () => {
    console.log(`Escuchando por el puerto ${PORT}`); 
    //console.log("Escuchando por el puerto " + PORT); 
});