import mongoose from "mongoose";

const subUserSchema = new mongoose.Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Company", 
    required: true 
  }, // belongs to a company
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String 
  }, // optional: role/position in the company
  branch: { 
    type: String 
  }, // optional: company branch they belong to

  // 🔹 Team Access (toggle each feature)
  access: {
    carManagement: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false },
    setting: { type: Boolean, default: false },
    salesAndPayments: { type: Boolean, default: false },
    investors: { type: Boolean, default: false },
    dashboardUnits: { type: Boolean, default: false },
  },

}, { timestamps: true });

export default mongoose.models.SubUser || mongoose.model("SubUser", subUserSchema);


