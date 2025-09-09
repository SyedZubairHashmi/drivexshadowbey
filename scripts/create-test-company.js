const mongoose = require('mongoose');
require('dotenv').config();

// Company Schema (same as in your Company.ts model)
const CompanySchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['company', 'admin'], default: 'company' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperAdmin' },
  // Optional fields for company settings
  pin: { type: String, default: '123456' },
  recoveryEmail: { type: String },
}, { timestamps: true });

const Company = mongoose.models.Company || mongoose.model('Company', CompanySchema);

async function createTestCompany() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if test company already exists
    const existingCompany = await Company.findOne({ companyEmail: 'admin@drivexdeal.com' });
    
    if (existingCompany) {
      console.log('Test company already exists:', existingCompany.companyEmail);
      return;
    }

    // Create test company for multi-tenant platform
    const testCompany = new Company({
      ownerName: 'Admin Owner',
      companyName: 'DriveX Deal Admin',
      companyEmail: 'admin@drivexdeal.com',
      password: '123456',
      role: 'admin', // Admin role for testing
      status: 'active',
      pin: '123456',
      recoveryEmail: 'admin@drivexdeal.com'
    });

    await testCompany.save();
    console.log('Test company created successfully:');
    console.log('Email: admin@drivexdeal.com');
    console.log('Password: 123456');
    console.log('PIN: 123456');
    console.log('You can now use these credentials to login');

  } catch (error) {
    console.error('Error creating test company:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestCompany();
