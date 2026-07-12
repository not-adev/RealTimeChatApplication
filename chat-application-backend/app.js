import express from 'express';
import 'dotenv/config';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { connectToDb } from './src/config/db.js';
import chatRoutes from './src/routes/chat.routes.js';
import logger from './src/middleware/logginMiddleware.js';

await connectToDb();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  process.env.FRONT_END_URL,
  process.env.SOCKET_IO_FRONEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
const io = new Server(httpServer, {
  cors: corsOptions,
});

app.use(express.json());

app.use(logger);
app.use('/api', chatRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});