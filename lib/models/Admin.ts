import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin"], default: "admin" },
}, { timestamps: true });

// Clear any existing model to prevent cache issues
if (mongoose.models.Admin) {
  delete mongoose.models.Admin;
}

export default mongoose.model("Admin", adminSchema);

