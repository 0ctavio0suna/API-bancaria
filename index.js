require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./routes/usuarios');
const auth = require('./routes/authRoutes'); // Cambia la ruta para reflejar el nombre correcto del archivo

const PORT = process.env.PORT || 3008;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(users);  // Rutas de usuarios
app.use(auth);   // Rutas de autenticación

app.listen(PORT, () => {
    console.log(`Escuchando por el puerto ${PORT}`);
});