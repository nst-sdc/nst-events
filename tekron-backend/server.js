require('dotenv').config();
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

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
