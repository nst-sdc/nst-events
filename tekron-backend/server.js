require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const participantRoutes = require('./src/routes/participantRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const superAdminRoutes = require('./src/routes/superAdminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/participant', participantRoutes);
app.use('/admin', adminRoutes);
app.use('/superadmin', superAdminRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'Tekron Backend is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Create HTTP Server
const server = http.createServer(app);

// Socket.IO Setup
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

io.engine.on("connection_error", (err) => {
    console.log("Engine error:", err.req ? err.req.url : 'unknown', err.code, err.message);
});

// Start Server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on 0.0.0.0:${PORT}`);
});

// Export io for use in controllers
module.exports = { app, io };
