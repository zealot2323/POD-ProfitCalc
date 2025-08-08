import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

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

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});