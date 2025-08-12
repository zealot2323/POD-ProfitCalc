import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { readCSVOrders } from '../src/readCSVOrders.server.js';

dotenv.config();
const app = express();
const PORT = 3001;

app.use(express.json());

// Proxy route for Printify
app.use('/api/printify', async (req, res) => {
  const url = `https://api.printify.com/v1${req.originalUrl.replace('/api/printify', '')}`;

  const response = await fetch(url, {
    method: req.method,
    headers: {
      'Authorization': `Bearer ${process.env.PRINTIFY_API_KEY}`,
      'Content-Type': 'application/json',
      'User-Agent': 'JS'
    },
    body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
  });

  const data = await response.json();
  res.status(response.status).json(data);
});

// CSV route
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await readCSVOrders();
    res.json(orders);
  } catch (err) {
    console.error("Error reading CSV:", err.message);
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});