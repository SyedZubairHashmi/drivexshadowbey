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
  },
  { timestamps: true }
);

// Index for quick search - now includes companyId for multi-tenant isolation
batchSchema.index({ companyId: 1, batchNo: 1, countryOfOrigin: 1 });

// Compound unique index: batchNo must be unique within each company
batchSchema.index({ companyId: 1, batchNo: 1 }, { unique: true });

// Clear any existing model to ensure fresh schema
if (mongoose.models.Batch) {
  delete mongoose.models.Batch;
}

export default mongoose.model("Batch", batchSchema);





