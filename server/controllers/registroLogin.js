const db = require("./db");
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Para manejar tokens
const app = express();
const cors = require('cors');

app.use(express.json()); // Para parsear JSON

async function getAllRegistroLogin() {
    app.use(cors());
    // Registro de usuario
    app.post("/api/registro", async (req, res) => {
        const { nombre, apellido, telefono, correo, idPuesto, usuario, contrasena } = req.body;

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Registrar en la tabla `personal`
        db.query('INSERT INTO personal (nombre, apellido, telefono, correo, idPuesto) VALUES (?, ?, ?, ?, ?)', 
        [nombre, apellido, telefono, correo, idPuesto], (err, result) => {
            if (err) return res.status(500).json(err);

            const idPersonal = result.insertId;

            // Registrar en la tabla `usuarios`
            db.query('INSERT INTO usuario (usuario, contrasena, idPersonal) VALUES (?, ?, ?)', 
            [usuario, hashedPassword, idPersonal], (err) => {
                if (err) return res.status(500).json(err);
                res.status(201).json({ message: 'Usuario registrado exitosamente' });
            });
        });
    });

    // Login de usuario
    app.post("/api/login", async (req, res) => {
        const { usuario, contrasena } = req.body;

        db.query('SELECT * FROM usuario WHERE usuario = ?', [usuario], async (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

            const user = results[0];
            const isMatch = await bcrypt.compare(contrasena, user.contrasena);

            if (isMatch) {
                const token = jwt.sign({ 
                    idUsuario: user.idUsuario, // Cambia 'id' a 'idUsuario' si es necesario
                    usuario: user.usuario // Asegúrate de que 'usuario' es el campo correcto
                }, 'tu_clave_secreta', { expiresIn: '1h' });
                res.json({ message: 'Login exitoso', token, idUsuario: user.idUsuario });
            } else {
                res.status(401).json({ message: 'Contraseña incorrecta' });
            }
        });
    });

    //para listar los tipos de puestos para registro de personal
    app.get("/api/puesto", (req, res) => {
        db.query('SELECT * FROM puesto', (err, results) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.json(results);
        });
    });

    // Middleware para verificar el token
    const verifyToken = (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) return res.sendStatus(403);

        jwt.verify(token, 'tu_clave_secreta', (err, decoded) => {
            if (err) return res.sendStatus(403);
            req.userId = decoded.id;
            next();
        });
    };

    // Ejemplo de ruta protegida
    app.get('/api/protected', verifyToken, (req, res) => {
        res.json({ message: 'Acceso permitido', userId: req.userId });
    });

    // Iniciar el servidor
    app.listen(3006, () => {
        console.log('Servidor en ejecución en http://localhost:3006');
    });
}

//para exportar el archivo al archivo index
module.exports = { getAllRegistroLogin };
