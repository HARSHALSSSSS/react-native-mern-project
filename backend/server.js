require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const venueRoutes = require('./routes/venueRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const checkinRoutes = require('./routes/checkinRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const seedRoutes = require('./routes/seedRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/user/auth', userAuthRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/seed', seedRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Event Management API is running',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
