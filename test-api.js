// Simple test script to debug API issues
const testBatchData = {
  "batchNo": "BATCH-2023-001",
  "investor": {
    "name": "Muhammad Ali",
    "contactNumber": "+92-300-9876543",
    "emailAddress": "muhammad.ali@email.com",
    "investorId": "INV-2023-001",
    "cnic": "35202-9876543-1",
    "investmentAmount": 10000000,
    "percentageShare": 30,
    "paymentDate": "2023-09-01T10:00:00.000Z",
    "paymentMethod": "bank_transfer"
  },
  "supportDocuments": [
    {
      "documentType": "pdf",
      "fileName": "investment_agreement_batch_001.pdf",
      "fileUrl": "https://example.com/documents/agreement_batch_001.pdf"
    },
    {
      "documentType": "image",
      "fileName": "cnic_front_batch_001.jpg",
      "fileUrl": "https://example.com/documents/cnic_front_batch_001.jpg"
    }
  ],
  "notes": "First batch of 2023 with premium vehicles"
};

// Test batch creation
async function testBatchCreation() {
  try {
    const response = await fetch('http://localhost:3000/api/batches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBatchData)
    });

    const result = await response.json();
    console.log('Batch Creation Response:', result);
    
    if (result.success) {
      console.log('✅ Batch created successfully!');
      console.log('Batch ID:', result.data._id);
      return result.data._id;
    } else {
      console.log('❌ Batch creation failed:', result.error);
      if (result.details) {
        console.log('Validation details:', result.details);
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Test car creation (after batch is created)
async function testCarCreation(batchId) {
  const testCarData = {
    "carName": "Toyota Camry XSE",
    "company": "Toyota",
    "engineNumber": "2.5L-ENG-2023-001",
    "chasisNumber": "CHS-TOY-2023-001",
    "auctionGrade": 4,
    "importYear": 2023,
    "assembly": "import",
    "engineCapacity": "2.5L",
    "interiorColor": "Black",
    "mileage": "25,000 km",
    "keywords": ["sedan", "automatic", "hybrid", "premium"],
    "color": "Pearl White",
    "deliveryTimeframe": "2-3 weeks",
    "batchNo": batchId,
    "description": "Excellent condition Toyota Camry XSE with premium features. Low mileage and well-maintained.",
    "financing": {
      "auctionPrice": 2500000,
      "auctionTaxes": 125000,
      "inlandCharges": 75000,
      "shipmentCharges": 100000,
      "variantDuty": 200000,
      "passportCharges": 30000,
      "serviceCharges": 40000,
      "transportCharges": 25000,
      "repairCharges": 60000,
      "miscellaneousCharges": 35000
    },
    "images": {
      "coverPhoto": "https://example.com/images/camry-cover.jpg",
      "auctionSheet": "https://example.com/documents/camry-auction.pdf",
      "carPictures": [
        "https://example.com/images/camry-front.jpg",
        "https://example.com/images/camry-side.jpg",
        "https://example.com/images/camry-back.jpg",
        "https://example.com/images/camry-interior.jpg"
      ]
    },
    "notes": "Premium sedan with advanced safety features",
    "isFeatured": true
  };

  try {
    const response = await fetch('http://localhost:3000/api/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCarData)
    });

    const result = await response.json();
    console.log('Car Creation Response:', result);
    
    if (result.success) {
      console.log('✅ Car created successfully!');
    } else {
      console.log('❌ Car creation failed:', result.error);
      if (result.details) {
        console.log('Validation details:', result.details);
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  console.log('📦 Testing Batch Creation...');
  const batchId = await testBatchCreation();
  
  if (batchId) {
    console.log('\n🚗 Testing Car Creation...');
    await testCarCreation(batchId);
  }
  
  console.log('\n✅ Tests completed!');
}

// Run if this file is executed directly
if (typeof window === 'undefined') {
  runTests();
}





