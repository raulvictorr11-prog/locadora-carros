require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

let connection;

// Conexão com o MySQL
async function start() {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      // 🔑 SOLUÇÃO: Adiciona a configuração SSL para cumprir a exigência do Azure
      ssl: { 
          // Desabilita a verificação rigorosa do certificado, permitindo a conexão
          rejectUnauthorized: false 
      }
    });
    console.log('Conectado ao banco com sucesso!');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
  }
}

start();

// -------------------------
// Endpoints básicos
// -------------------------

// Veículos
app.get('/api/vehicles', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM vehicles');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vehicles', async (req, res) => {
  try {
    const { brand, model, year, plate, daily_price, available } = req.body;
    const [result] = await connection.execute(
      'INSERT INTO vehicles (brand, model, year, plate, daily_price, available) VALUES (?, ?, ?, ?, ?, ?)',
      [brand, model, year, plate, daily_price, available]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clientes
app.get('/api/clients', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM clients');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { full_name, email, phone, document } = req.body;
    const [result] = await connection.execute(
      'INSERT INTO clients (full_name, email, phone, document) VALUES (?, ?, ?, ?)',
      [full_name, email, phone, document]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Locações
app.get('/api/rentals', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM rentals');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rentals', async (req, res) => {
  try {
    const { client_id, vehicle_id, start_datetime, end_datetime, total_price, status } = req.body;
    const [result] = await connection.execute(
      'INSERT INTO rentals (client_id, vehicle_id, start_datetime, end_datetime, total_price, status) VALUES (?, ?, ?, ?, ?, ?)',
      [client_id, vehicle_id, start_datetime, end_datetime, total_price, status || 'ACTIVE']
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});