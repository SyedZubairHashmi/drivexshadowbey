# DriveX API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, no authentication is required for API endpoints.

## Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "data": {...},
  "message": "Success/Error message",
  "error": "Error details (if applicable)",
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "pages": 2
  }
}
```

---

## Cars API

### GET /api/cars
Get all cars with optional filtering and pagination.

**Query Parameters:**
- `batchNo` (string): Filter by batch number
- `status` (string): Filter by car status (available, in_transit, warehouse, sold, reserved)
- `company` (string): Filter by company name (case-insensitive search)
- `auctionGrade` (number): Filter by auction grade (1-5)
- `isFeatured` (boolean): Filter by featured status
- `limit` (number): Number of items per page (default: 50)
- `page` (number): Page number (default: 1)

**Example Request:**
```bash
GET /api/cars?status=available&company=toyota&limit=10&page=1
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "carName": "Toyota Camry",
      "company": "Toyota",
      "engineNumber": "2.5L-123456",
      "chasisNumber": "CHS-789012",
      "auctionGrade": 4,
      "importYear": 2022,
      "assembly": "import",
      "engineCapacity": "2.5L",
      "interiorColor": "Black",
      "mileage": "15k",
      "keywords": ["sedan", "automatic"],
      "status": "available",
      "color": "White",
      "deliveryTimeframe": "2-3 weeks",
      "batchNo": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "batchNo": "BATCH-001",
        "investor": {
          "name": "John Doe"
        }
      },
      "description": "Excellent condition car",
      "financing": {
        "auctionPrice": 2000000,
        "auctionTaxes": 100000,
        "inlandCharges": 50000,
        "shipmentCharges": 75000,
        "variantDuty": 150000,
        "passportCharges": 25000,
        "serviceCharges": 30000,
        "transportCharges": 20000,
        "repairCharges": 50000,
        "miscellaneousCharges": 25000
      },
      "images": {
        "coverPhoto": "cover.jpg",
        "auctionSheet": "auction.pdf",
        "carPictures": ["pic1.jpg", "pic2.jpg", "pic3.jpg", "pic4.jpg"]
      },
      "totalCost": 2450000,
      "createdAt": "2023-09-05T10:30:00.000Z",
      "updatedAt": "2023-09-05T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### GET /api/cars/[id]
Get a specific car by ID.

**Path Parameters:**
- `id` (string): Car ID

**Example Request:**
```bash
GET /api/cars/64f8a1b2c3d4e5f6a7b8c9d0
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "carName": "Toyota Camry",
    // ... (same as above)
  }
}
```

### POST /api/cars
Create a new car.

**Request Body:**
```json
{
  "carName": "Toyota Camry",
  "company": "Toyota",
  "engineNumber": "2.5L-123456",
  "chasisNumber": "CHS-789012",
  "auctionGrade": 4,
  "importYear": 2022,
  "assembly": "import",
  "engineCapacity": "2.5L",
  "interiorColor": "Black",
  "mileage": "15k",
  "keywords": ["sedan", "automatic"],
  "color": "White",
  "deliveryTimeframe": "2-3 weeks",
  "batchNo": "64f8a1b2c3d4e5f6a7b8c9d1",
  "description": "Excellent condition car",
  "financing": {
    "auctionPrice": 2000000,
    "auctionTaxes": 100000,
    "inlandCharges": 50000,
    "shipmentCharges": 75000,
    "variantDuty": 150000,
    "passportCharges": 25000,
    "serviceCharges": 30000,
    "transportCharges": 20000,
    "repairCharges": 50000,
    "miscellaneousCharges": 25000
  },
  "images": {
    "coverPhoto": "cover.jpg",
    "auctionSheet": "auction.pdf",
    "carPictures": ["pic1.jpg", "pic2.jpg", "pic3.jpg", "pic4.jpg"]
  },
  "notes": "Optional notes",
  "isFeatured": false
}
```

**Required Fields:**
- `carName`, `company`, `engineNumber`, `chasisNumber`
- `auctionGrade` (1-5), `importYear`, `assembly` (local/import)
- `engineCapacity`, `interiorColor`, `mileage`, `color`
- `deliveryTimeframe`, `batchNo`, `description`
- `financing` (all fields), `images` (coverPhoto, auctionSheet, carPictures - minimum 4)

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    // ... (created car data)
  },
  "message": "Car created successfully"
}
```

### PUT /api/cars/[id]
Update a specific car.

**Path Parameters:**
- `id` (string): Car ID

**Request Body:** Same as POST, but all fields are optional.

**Example Request:**
```bash
PUT /api/cars/64f8a1b2c3d4e5f6a7b8c9d0
Content-Type: application/json

{
  "status": "sold",
  "saleInfo": {
    "soldPrice": 2500000,
    "soldDate": "2023-09-10T10:30:00.000Z",
    "buyerInfo": {
      "name": "Jane Smith",
      "contactNumber": "+1234567890",
      "emailAddress": "jane@example.com",
      "cnic": "12345-1234567-1"
    }
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    // ... (updated car data)
  },
  "message": "Car updated successfully"
}
```

### DELETE /api/cars/[id]
Delete a specific car.

**Path Parameters:**
- `id` (string): Car ID

**Example Request:**
```bash
DELETE /api/cars/64f8a1b2c3d4e5f6a7b8c9d0
```

**Example Response:**
```json
{
  "success": true,
  "message": "Car deleted successfully"
}
```

---

## Batches API

### GET /api/batches
Get all batches with optional filtering and pagination.

**Query Parameters:**
- `status` (string): Filter by batch status (active, completed, pending, cancelled)
- `investorEmail` (string): Filter by investor email (case-insensitive search)
- `investorCnic` (string): Filter by investor CNIC (case-insensitive search)
- `limit` (number): Number of items per page (default: 50)
- `page` (number): Page number (default: 1)

**Example Request:**
```bash
GET /api/batches?status=active&limit=10&page=1
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "batchNo": "BATCH-001",
      "investor": {
        "name": "John Doe",
        "contactNumber": "+1234567890",
        "emailAddress": "john@example.com",
        "investorId": "INV-001",
        "cnic": "12345-1234567-1",
        "investmentAmount": 5000000,
        "percentageShare": 25,
        "paymentDate": "2023-09-01T10:30:00.000Z",
        "paymentMethod": "bank_transfer"
      },
      "supportDocuments": [
        {
          "documentType": "pdf",
          "fileName": "investment_agreement.pdf",
          "fileUrl": "https://example.com/files/agreement.pdf",
          "uploadedAt": "2023-09-01T10:30:00.000Z"
        }
      ],
      "status": "active",
      "totalCars": 5,
      "soldCars": 2,
      "revenue": 5000000,
      "notes": "Batch notes",
      "createdAt": "2023-09-01T10:30:00.000Z",
      "updatedAt": "2023-09-01T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

### GET /api/batches/[id]
Get a specific batch by ID with real-time car statistics.

**Path Parameters:**
- `id` (string): Batch ID

**Example Request:**
```bash
GET /api/batches/64f8a1b2c3d4e5f6a7b8c9d1
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "batchNo": "BATCH-001",
    // ... (same as above)
    "totalCars": 5,
    "soldCars": 2,
    "revenue": 5000000
  }
}
```

### POST /api/batches
Create a new batch.

**Request Body:**
```json
{
  "batchNo": "BATCH-001",
  "investor": {
    "name": "John Doe",
    "contactNumber": "+1234567890",
    "emailAddress": "john@example.com",
    "investorId": "INV-001",
    "cnic": "12345-1234567-1",
    "investmentAmount": 5000000,
    "percentageShare": 25,
    "paymentDate": "2023-09-01T10:30:00.000Z",
    "paymentMethod": "bank_transfer"
  },
  "supportDocuments": [
    {
      "documentType": "pdf",
      "fileName": "investment_agreement.pdf",
      "fileUrl": "https://example.com/files/agreement.pdf"
    }
  ],
  "notes": "Optional batch notes"
}
```

**Required Fields:**
- `batchNo` (unique), `investor` (all fields)
- `percentageShare` (0-100)

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    // ... (created batch data)
  },
  "message": "Batch created successfully"
}
```

### PUT /api/batches/[id]
Update a specific batch.

**Path Parameters:**
- `id` (string): Batch ID

**Request Body:** Same as POST, but all fields are optional.

**Example Request:**
```bash
PUT /api/batches/64f8a1b2c3d4e5f6a7b8c9d1
Content-Type: application/json

{
  "status": "completed",
  "notes": "Batch completed successfully"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    // ... (updated batch data)
  },
  "message": "Batch updated successfully"
}
```

### DELETE /api/batches/[id]
Delete a specific batch (only if no cars are associated).

**Path Parameters:**
- `id` (string): Batch ID

**Example Request:**
```bash
DELETE /api/batches/64f8a1b2c3d4e5f6a7b8c9d1
```

**Example Response:**
```json
{
  "success": true,
  "message": "Batch deleted successfully"
}
```

**Error Response (if cars exist):**
```json
{
  "success": false,
  "error": "Cannot delete batch. It has 5 car(s) associated with it. Please remove or reassign the cars first."
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Car name is required",
    "At least 4 car pictures are required"
  ]
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "error": "Car not found"
}
```

### Conflict Error (409)
```json
{
  "success": false,
  "error": "Car with this engine number or chassis number already exists"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Failed to fetch cars"
}
```

---

## Frontend Integration

Use the provided `lib/api.ts` utility functions for easy frontend integration:

```typescript
import { carAPI, batchAPI } from '@/lib/api';

// Get all cars
const cars = await carAPI.getAll({ status: 'available', limit: 10 });

// Create a new car
const newCar = await carAPI.create(carData);

// Update a car
const updatedCar = await carAPI.update(carId, updateData);

// Delete a car
await carAPI.delete(carId);

// Get all batches
const batches = await batchAPI.getAll({ status: 'active' });

// Create a new batch
const newBatch = await batchAPI.create(batchData);
```

---

## Data Types

### Car Status
- `available`: Car is available for sale
- `in_transit`: Car is in transit
- `warehouse`: Car is in warehouse
- `sold`: Car has been sold
- `reserved`: Car is reserved

### Batch Status
- `active`: Batch is active
- `completed`: Batch is completed
- `pending`: Batch is pending
- `cancelled`: Batch is cancelled

### Assembly Type
- `local`: Locally assembled
- `import`: Imported

### Payment Method
- `cash`: Cash payment
- `bank_transfer`: Bank transfer
- `cheque`: Cheque payment
- `online`: Online payment

### Document Type
- `pdf`: PDF document
- `image`: Image file





