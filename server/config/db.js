import mongoose from 'mongoose';
import dns from 'dns';

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('\n❌ DATABASE CONNECTION FAILED: MONGODB_URI environment variable is not defined.\n');
    return false;
  }

  try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  } catch (dnsErr) {
    console.warn('⚠️ Custom DNS servers could not be set:', dnsErr.message);
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      dbName: 'ssci',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`\n✅ DATABASE CONNECTED: Connected to MongoDB Atlas [${conn.connection.name}] at ${conn.connection.host}\n`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('⚠️  MongoDB Connection Error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB connection lost. Reconnecting...');
    });

    return true;
  } catch (error) {
    console.error('\n❌ DATABASE CONNECTION FAILED:', error.message, '\n');
    return false;
  }
};

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection gracefully closed due to app termination.');
  process.exit(0);
});
