const dns = require('dns');
const defaultServers = dns.getServers();

if (defaultServers.length === 1 && defaultServers[0] === '127.0.0.1') {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
}

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const app = require('./app');
const connectDB = require('./config/db');

// Ensure fallback JWT secret cannot silently become the production secret
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('[FATAL] JWT_SECRET environment variable is required in production.');
  process.exit(1);
}

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
