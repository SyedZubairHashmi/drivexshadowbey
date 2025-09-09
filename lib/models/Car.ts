import mongoose from "mongoose";

const amountWithRateSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 }, // e.g. 23234
    rate: { type: Number, required: true, min: 0 }, // conversion rate
    totalAmount: { type: Number, required: true, min: 0 }, // amount × rate
  },
  { _id: false }
);

const carSchema = new mongoose.Schema(
  {
    // Multi-tenant field
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    
    // Basic Car Information
    carName: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
  
    carSegment: {
      type: String,
      enum: ["SUV", "Sedan", "Hatchback", "Truck", "Van", "Kei", "Other"],
      required: true,
    },

    engineNumber: { type: String, required: true, trim: true },
    chasisNumber: { type: String, required: true, trim: true },
    auctionGrade: { type: Number, required: true, min: 3, max: 6 }, // Updated to support 3-6 range
    importYear: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    manufacturingYear: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    assembly: { 
      type: String, 
      enum: ["Import", "Local", "CKD", "CBU", "JDM"], 
      required: true 
    },
    engineCapacity: { type: String, required: true, trim: true },
    engineType: {
      type: String,
      enum: ["Petrol", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid", "CNG", "LPG"],
      required: true,
    },
    interiorColor: { type: String, required: true, trim: true },
    mileage: { type: String, required: true, trim: true },
    keywords: [{ type: String, trim: true }],
    features: [{ type: String, trim: true }], // New field for car features

    // Car Status
    status: {
      type: String,
      enum: ["sold", "transit", "warehouse", "showroom"],
      default: "warehouse",
    },
    exteriorColor: { type: String, required: true, trim: true },
    deliveryTimeframe: { type: String, required: false, trim: true },
    batchNo: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    // Financing (with amount + currency + rate)
    financing: {
      originCity: { type: String, required: true, trim: true },
      destinationCity: { type: String, required: true, trim: true },

      auctionPrice: { type: amountWithRateSchema, required: true },
      auctionExpenses: { type: amountWithRateSchema, required: true }, // Changed from auctionTaxes
      inlandCharges: { type: amountWithRateSchema, required: true },
      loadingCharges: { type: amountWithRateSchema, required: true },
      containerCharges: { type: amountWithRateSchema, required: true },
      freightSea: { type: amountWithRateSchema, required: true },

      // Simple PKR values
      variantDuty: { type: Number, required: true, min: 0 },
      passportCharges: { type: Number, required: true, min: 0 },
      servicesCharges: { type: Number, required: true, min: 0 }, // Changed from serviceCharges
      transportCharges: { type: Number, required: true, min: 0 },
      repairCharges: { type: Number, required: true, min: 0 },
      miscellaneousCharges: { type: Number, required: true, min: 0 },
      
      // New financial fields
      vehicleValueCif: { type: Number, required: true, min: 0 },
      landingCharges: { type: Number, required: true, min: 0 },
      customsDuty: { type: Number, required: true, min: 0 },
      salesTax: { type: Number, required: true, min: 0 },
      federalExciseDuty: { type: Number, required: true, min: 0 },
      incomeTax: { type: Number, required: true, min: 0 },
      freightAndStorageCharges: { type: Number, required: true, min: 0 },
      demurrage: { type: Number, required: true, min: 0 },
      ageOfVehicle: { type: Number, required: true, min: 0 },
      
      // Finance Total Amount
      financeTotalAmount: { type: Number, required: true, min: 0, default: 0 },
    },

    // Sale Info
    saleInfo: {
      soldPrice: { type: Number, min: 0 },
      soldDate: { type: Date },
      buyerInfo: {
        name: { type: String, trim: true },
        contactNumber: { type: String, trim: true },
        emailAddress: { type: String, trim: true, lowercase: true },
        cnic: { type: String, trim: true },
      },
    },

    // Images and Documents
    images: {
      invoiceReceipt: { type: String,  trim: true },
      coverPhoto: { type: String,  trim: true },
      auctionSheet: { type: String,  trim: true },
      carPictures: [{ type: String,  trim: true }],
    },

    // Extra
    notes: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Virtual: total cost calculation
carSchema.virtual("totalCost").get(function () {
  const f = this.financing;
  if (!f) return 0;

  return (
    (f.auctionPrice?.totalAmount || 0) +
    (f.auctionExpenses?.totalAmount || 0) + // Changed from auctionTaxes
    (f.inlandCharges?.totalAmount || 0) +
    (f.loadingCharges?.totalAmount || 0) +
    (f.containerCharges?.totalAmount || 0) +
    (f.freightSea?.totalAmount || 0) +
    f.variantDuty +
    f.passportCharges +
    f.servicesCharges + // Changed from serviceCharges
    f.transportCharges +
    f.repairCharges +
    f.miscellaneousCharges +
    f.vehicleValueCif + // New field
    f.landingCharges + // New field
    f.customsDuty + // New field
    f.salesTax + // New field
    f.federalExciseDuty + // New field
    f.incomeTax + // New field
    f.freightAndStorageCharges + // New field
    f.demurrage + // New field
    f.ageOfVehicle // New field
  );
});

// Validation: minimum 4 car images - REMOVED FOR NOW
// carSchema.pre("save", function (next) {
//   if (this.images?.carPictures?.length < 4) {
//     next(new Error("At least 4 car pictures are required"));
//   } else {
//     next();
//   }
// });

// Compound unique index: chasisNumber must be unique within each company
carSchema.index({ companyId: 1, chasisNumber: 1 }, { unique: true });

// Force model recompilation to ensure latest schema
if (mongoose.models.Car) {
  delete mongoose.models.Car;
}
const Car = mongoose.model("Car", carSchema);
export default Car;
