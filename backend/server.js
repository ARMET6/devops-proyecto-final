const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de Logs
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}
const logFile = path.join(logDirectory, 'app.log');

const writeLog = (message, type = 'INFO') => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logMessage = `[${timestamp}] ${type}: ${message}\n`;
    fs.appendFileSync(logFile, logMessage);
    console.log(logMessage.trim());
};

// Conexión a MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'gym_tracker'
});

// 1. CREATE: Agregar un nuevo entrenamiento
app.post('/api/entrenamientos', (req, res) => {
    const { rutina, ejercicio, series, repeticiones } = req.body;
    const query = 'INSERT INTO entrenamientos (rutina, ejercicio, series, repeticiones) VALUES (?, ?, ?, ?)';
    
    db.query(query, [rutina, ejercicio, series, repeticiones], (err, result) => {
        if (err) {
            writeLog(`Error al insertar: ${err.message}`, 'ERROR');
            return res.status(500).send(err);
        }
        writeLog(`Nuevo entrenamiento agregado: ${ejercicio}`, 'INFO');
        res.json({ id: result.insertId, ...req.body });
    });
});

// 2. READ: Obtener entrenamientos
app.get('/api/entrenamientos', (req, res) => {
    db.query('SELECT * FROM entrenamientos ORDER BY fecha DESC', (err, results) => {
        if (err) {
            writeLog('Fallo en conexión a base de datos', 'ERROR');
            res.status(500).send(err);
        } else {
            writeLog('Consulta de lectura realizada', 'INFO');
            res.json(results);
        }
    });
});

// 3. DELETE: Borrar un entrenamiento
app.delete('/api/entrenamientos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM entrenamientos WHERE id = ?', [id], (err, result) => {
        if (err) {
            writeLog(`Error al borrar ID ${id}`, 'ERROR');
            return res.status(500).send(err);
        }
        writeLog(`Entrenamiento ID ${id} eliminado`, 'INFO');
        res.json({ message: 'Eliminado correctamente' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    writeLog(`Servidor iniciado en el puerto ${PORT}`, 'INFO');
});)