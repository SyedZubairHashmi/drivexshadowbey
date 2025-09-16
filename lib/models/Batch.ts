import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    // Multi-tenant field
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    
    batchNo: {
      type: String, // like "0", "01", "02", "11"
      required: true,
      trim: true,
    },
    countryOfOrigin: {
      type: String,
      required: true,
      trim: true,
    },
    flagImage: {
      type: String, // flag image URL
      required: true,
    },
    investors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Investor", // references Investor model
      },
    ],
    cars: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car", // references Car model
      },
    ],
    notes: {
      type: String,
      trim: true,
    },

    // 📊 Financial fields
    totalCost: {
      type: Number, // total cost of the batch (e.g. purchase cost of cars, import duties, etc.)
      default: 0,
    },
    totalSalePrice: {
      type: Number, // expected/actual total sale price of batch
      default: 0,
    },
    totalExpense: {
      type: Number, // all expenses related to this batch (transport, customs, repairs, etc.)
      default: 0,
    },
    totalInvestment: {
      type: Number, // how much investors invested in this batch
      default: 0,
    },
    totalRevenue: {
      type: Number, // calculated: totalSalePrice - totalCost
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for quick search - now includes companyId for multi-tenant isolation
batchSchema.index({ companyId: 1, batchNo: 1, countryOfOrigin: 1 });

// Compound unique index: batchNo must be unique within each company
batchSchema.index({ companyId: 1, batchNo: 1 }, { unique: true });

// Virtual field for revenue calculation
batchSchema.virtual('revenue').get(function() {
  return this.totalSalePrice - this.totalCost;
});

// Virtual field for profit calculation
batchSchema.virtual('profit').get(function() {
  const revenue = (this.totalSalePrice || 0) - (this.totalCost || 0);
  return revenue - (this.totalExpense || 0);
});

// Ensure virtual fields are serialized
batchSchema.set('toJSON', { virtuals: true });
batchSchema.set('toObject', { virtuals: true });

// Clear any existing model to ensure fresh schema
if (mongoose.models.Batch) {
  delete mongoose.models.Batch;
}

export default mongoose.model("Batch", batchSchema);





