const jwt = require('jsonwebtoken'); // Librería para manejar JWT
const secretKey = 'tu_clave_secreta'; // Cambia esto por tu clave secreta

// Middleware para verificar si el token está presente y es válido
const checkSession = (req, res, next) => {
    const token = req.headers['authorization']; // Obtener el token del encabezado Authorization

    if (!token) {
        return res.status(401).json({ message: 'No estás autenticado' });
    }

    // Eliminar 'Bearer ' del token si es necesario
    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;

    // Verificar el token
    jwt.verify(tokenWithoutBearer, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }

        // El token es válido, almacenar el usuario decodificado en el objeto request (req)
        req.user = decoded; // Esto puede ser el payload del JWT, como el ID del usuario
        next(); // Continuar con la siguiente función en la cadena
    });
};

module.exports = checkSession;
