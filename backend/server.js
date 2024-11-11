const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const patentRoutes = require('./routes/patent.routes');
const ipfsRoutes = require('./routes/ipfsRoutes');
const authRoutes=require('./routes/authRoutes')
// Initialize express
const app = express();

// Enhanced Security Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Add all your frontend URLs
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
  }));

// General Middleware
app.use(morgan('dev')); // Logging
app.use(cookieParser()); // Cookie parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/auth', authRoutes);


app.use('/api/patents', patentRoutes);
// Database connection with enhanced error handling
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => console.log('📦 Connected to MongoDB'))
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// Monitor MongoDB connection
mongoose.connection.on('error', err => {
    console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
});

// Routes with versioning
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/patents', patentRoutes);
app.use('/api/v1/ipfs', ipfsRoutes);

// Health check routes
app.get('/health', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV,
        memoryUsage: process.memoryUsage(),
    };
    try {
        res.send(healthcheck);
    } catch (error) {
        healthcheck.message = error;
        res.status(503).send();
    }
});

// API documentation route
app.get('/api/v1/docs', (req, res) => {
    res.json({
        version: '1.0',
        endpoints: {
            users: {
                login: 'POST /api/v1/users/login',
                register: 'POST /api/v1/users/register',
                logout: 'POST /api/v1/users/logout',
                profile: 'GET /api/v1/users/profile',
                updateProfile: 'PUT /api/v1/users/profile'
            },
            patents: {
                create: 'POST /api/v1/patents',
                getAll: 'GET /api/v1/patents',
                getMine: 'GET /api/v1/patents/my',
                getOne: 'GET /api/v1/patents/:id'
            },
            ipfs: {
                upload: 'POST /api/v1/ipfs/upload',
                get: 'GET /api/v1/ipfs/:hash'
            }
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Handle undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'Route not found',
        availableRoutes: [
            '/api/v1/users/*',
            '/api/v1/patents/*',
            '/api/v1/ipfs/*',
            '/health',
            '/api/v1/docs'
        ]
    });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📚 API Docs available at: http://localhost:${PORT}/api/v1/docs`);
});

// Enhanced error handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Close server & exit process
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Close server & exit process
    server.close(() => process.exit(1));
});

// Graceful shutdown
const gracefulShutdown = async () => {
    console.log('🔄 Received shutdown signal...');
    
    try {
        // Close server
        await new Promise((resolve) => {
            server.close(resolve);
        });
        console.log('👋 Server closed');

        // Close database connection
        await mongoose.connection.close();
        console.log('📦 Database connection closed');

        console.log('✅ Graceful shutdown completed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;