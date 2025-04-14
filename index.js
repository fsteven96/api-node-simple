const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware para leer JSON
app.use(bodyParser.json());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./usuarios.db');

// Crear la tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  correo TEXT
)`);

// Ruta GET - obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  db.all('SELECT * FROM usuarios', [], (err, filas) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(filas);
    }
  });
});

// Ruta POST - agregar nuevo usuario
app.post('/usuarios', (req, res) => {
  const { nombre, correo } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ error: 'Falta nombre o correo' });
  }

  const sql = 'INSERT INTO usuarios (nombre, correo) VALUES (?, ?)';
  db.run(sql, [nombre, correo], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, nombre, correo });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
