import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["company", "admin"], default: "company" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "SuperAdmin" },
  // Optional fields for company settings
  pin: { type: String, default: "123456" },
  recoveryEmail: { type: String },
}, { timestamps: true });

// Clear any existing model to prevent cache issues
if (mongoose.models.Company) {
  delete mongoose.models.Company;
}

export default mongoose.model("Company", companySchema);