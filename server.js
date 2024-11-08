const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Configura la base de datos SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos', err.message);
  } else {
    console.log('Conexión a la base de datos SQLite exitosa');
  }
});

// Ruta para registrar un nuevo usuario
app.post('/register', (req, res) => {
  const { nombre, contrasena } = req.body;
  const query = `INSERT INTO Usuarios (Nombre, Contrasena) VALUES (?, ?)`;
  db.run(query, [nombre, contrasena], function(err) {
    if (err) {
      res.json({ success: false, message: 'Error en el registro: ' + err.message });
    } else {
      res.json({ success: true });
    }
  });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
  const { nombre, contrasena } = req.body;
  const query = `SELECT * FROM Usuarios WHERE Nombre = ? AND Contrasena = ?`;
  db.get(query, [nombre, contrasena], (err, row) => {
    if (err) {
      res.json({ success: false, message: 'Error en la consulta: ' + err.message });
    } else if (row) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
