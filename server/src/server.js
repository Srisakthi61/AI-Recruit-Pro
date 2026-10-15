const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`  AI Recruit Pro API Server Running`);
    console.log(`  Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Port: ${PORT}`);
    console.log(`  API Endpoint: http://localhost:${PORT}/api`);
    console.log(`=========================================`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[UnhandledRejection]: ${err.message}`);
    server.close(() => process.exit(1));
  });
});
