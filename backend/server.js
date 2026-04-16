// ... (mismo inicio de server.js anterior)

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

// 2. READ: (Ya lo tienes, se mantiene igual)
app.get('/api/entrenamientos', (req, res) => {
    db.query('SELECT * FROM entrenamientos ORDER BY fecha DESC', (err, results) => {
        if (err) {
            writeLog('Error en consulta de lectura', 'ERROR');
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

// ... (mismo final de server.js)