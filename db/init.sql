CREATE DATABASE IF NOT EXISTS gym_tracker;
USE gym_tracker;

CREATE TABLE IF NOT EXISTS entrenamientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rutina VARCHAR(50) NOT NULL,
    ejercicio VARCHAR(100) NOT NULL,
    series INT NOT NULL,
    repeticiones INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de prueba
INSERT INTO entrenamientos (rutina, ejercicio, series, repeticiones) VALUES ('Push', 'Press de Banca', 4, 10);
INSERT INTO entrenamientos (rutina, ejercicio, series, repeticiones) VALUES ('Pull', 'Dominadas', 3, 8);