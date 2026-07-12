import express from 'express';
import 'dotenv/config';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { connectToDb } from './src/config/db.js';
import chatRoutes from './src/routes/chat.routes.js';

await connectToDb();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SOCKET_IO_FRONEND_URL || 'http://localhost:5173',
  },
});

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONT_END_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }),
);

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