import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('\n❌ DATABASE CONNECTION FAILED: MONGODB_URI environment variable is not defined.\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
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
