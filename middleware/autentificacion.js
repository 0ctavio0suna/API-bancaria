const jwt = require('jsonwebtoken');

function authVerify(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'No tiene permiso para ingresar' });
    }

    const bearer = token.split(' ')[1];

    try {
        const decoded = jwt.verify(bearer, 'secret');
        req.email_usuario = decoded.email;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Ocurrió un error, por favor vuelva a intentarlo: ' + err });
    }
}

module.exports = authVerify;