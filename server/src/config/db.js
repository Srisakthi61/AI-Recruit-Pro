const dns = require('dns');
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const servers = dns.getServers();
    if (servers.length === 1 && servers[0] === '127.0.0.1') {
      dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    }

    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-recruit-pro';
    const conn = await mongoose.connect(connUri);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
