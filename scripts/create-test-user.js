const mongoose = require('mongoose');
require('dotenv').config();

// User Schema (same as in your User.ts model)
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  secondName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  city: String,
  country: String,
  pin: { type: String, required: true },
  confirmPin: { type: String, required: true },
  recoveryEmail: String,
  image: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'admin@drivexdeal.com' });
    
    if (existingUser) {
      console.log('Test user already exists:', existingUser.email);
      return;
    }

    // Create test user
    const testUser = new User({
      firstName: 'Admin',
      secondName: 'User',
      email: 'admin@drivexdeal.com',
      city: 'Karachi',
      country: 'Pakistan',
      pin: '123456',
      confirmPin: '123456',
      recoveryEmail: 'admin@drivexdeal.com'
    });

    await testUser.save();
    console.log('Test user created successfully:');
    console.log('Email: admin@drivexdeal.com');
    console.log('PIN: 123456');
    console.log('You can now use these credentials to login');

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestUser();
