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

// Rutas de la API
app.get('/api/entrenamientos', (req, res) => {
    db.query('SELECT * FROM entrenamientos ORDER BY fecha DESC', (err, results) => {
        if (err) {
            writeLog('Fallo en conexión a base de datos al obtener entrenamientos', 'ERROR');
            res.status(500).send(err);
        } else {
            writeLog('Consulta de entrenamientos realizada', 'INFO');
            res.json(results);
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    writeLog(`Servidor iniciado en el puerto ${PORT}`, 'INFO');
});