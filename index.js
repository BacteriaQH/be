import express from 'express';
import { createServer, Agent } from 'http';
import { Server } from 'socket.io';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';

import configViewEngine from './config/viewEngine.js';
import initWebRoutes from './routes/index.router.js';

import connetDB from './config/db.js';

connetDB();
const app = express();
app.set('trust proxy', true);
// app.use(cors(corsOptions));
let httpServer = createServer(app);
let io = new Server(httpServer, {
    method: 'GET',
    agent: Agent({ keepAlive: true }),
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
        transports: ['websocket', 'polling', 'flashsocket'],
    },
    allowEIO3: true,
});
io.on('connection', (socket) => {
    console.log(`user ${socket.id} has connected`);
    io.to(socket.id).emit('your id', socket.id);
});
export const getIO = () => io;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configViewEngine(app);

initWebRoutes(app);

const PORT = process.env.PORT || 3001;
app.get('/', (req, res) => {
    res.send('hello api');
});

httpServer.listen(PORT, console.log(`Server listening on port ${PORT}`));
