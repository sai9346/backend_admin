// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package
const connectDB = require('./config/db');
const errorHandler = require('./utils/errorHandler');
const auditTrailRoutes = require('./routes/auditTrailRoutes'); 
const planChangeLogRoutes = require('./routes/planChangeLogRoutes');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
app.use(express.json()); // To parse JSON bodies

// Use CORS to allow requests from both localhost and Vercel frontend
const corsOptions = {
    origin: ['http://localhost:3000', 'https://frontend-admin-murex.vercel.app'], // Allow requests from both localhost and Vercel
    credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));

// API Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/plans', require('./routes/planRoutes'));
app.use('/api/renewals', require('./routes/renewalRoutes')); 
app.use('/api/accounts', require('./routes/accountRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/billing', require('./routes/billingRoutes'));
app.use('/api/otp', require('./routes/otpRoutes')); 
app.use('/api/notifications', require('./routes/notificationRoutes')); // Ensure this matches the route
app.use('/api/audit-trail', auditTrailRoutes);
app.use('/api/plan-change-log', planChangeLogRoutes);

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
