// server.js (or src/index.js)
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB } from './config/dbconfig.js';
import apiRoutes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 9001;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.use(bodyParser.json());

connectDB();

// disable caching
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/', (req, res) => res.send('✅ Backend Server is Running Successfully!'));

app.use('/api', apiRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://192.168.3.105:${PORT}`);
});
