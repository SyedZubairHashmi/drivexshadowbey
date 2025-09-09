import mongoose, { Schema, Document } from "mongoose";

// 🔹 Interface
export interface ICustomer extends Document {
  companyId: mongoose.Types.ObjectId; // Multi-tenant field
  vehicle: {
    companyName: string;
    model: string;
    chassisNumber: string;
  };
  customer: {
    name: string;
    phoneNumber: string;
    email?: string;
    address?: string;
  };
  sale: {
    saleDate: Date;
    salePrice: number;
    paidAmount: number;
    remainingAmount: number; // Calculated automatically: salePrice - paidAmount
    paymentMethod: {
      type: "Cash" | "Bank" | "Cheque" | "BankDeposit";
      details: {
        // For Cash → no extra fields
        bankName?: string;     // For Bank, Cheque, BankDeposit
        ibanNo?: string;       // For Bank
        accountNo?: string;    // For Bank
        chequeNo?: string;     // For Cheque
        chequeClearanceDate?: Date; // For Cheque
        slipNo?: string;       // For BankDeposit
      };
    };
    paymentStatus: "Completed" | "Pending" | "inprogress";
    note?: string;
    document?: string;
  };
}

// 🔹 Schema
const CustomerSchema: Schema = new Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    vehicle: {
      companyName: { type: String, required: true },
      model: { type: String, required: true },
      chassisNumber: { type: String, required: true },
    },
    customer: {
      name: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      email: { type: String }, // optional
      address: { type: String }, // optional
    },
    sale: {
      saleDate: { type: Date, default: Date.now },
      salePrice: { type: Number, required: true },
      paidAmount: { type: Number, required: true, default: 0 },
      remainingAmount: { type: Number, required: false }, // Will be calculated automatically
      
      // 🔹 Payment Method as Object
      paymentMethod: {
        type: {
          type: String,
          enum: ["Cash", "Bank", "Cheque", "BankDeposit"],
          required: true,
        },
        details: {
          bankName: { type: String },
          ibanNo: { type: String },
          accountNo: { type: String },
          chequeNo: { type: String },
          chequeClearanceDate: { type: Date },
          slipNo: { type: String },
        },
      },

      paymentStatus: {
        type: String,
        enum: ["Completed", "Pending", "inprogress"],
        default: "Pending",
      },
      note: { type: String }, // optional
      document: { type: String }, // file path or URL
    },
  },
  { timestamps: true }
);

// Pre-save middleware to automatically calculate remaining amount
CustomerSchema.pre('save', function(next) {
  const salePrice = Number(this.sale.salePrice) || 0;
  const paidAmount = Number(this.sale.paidAmount) || 0;
  
  this.sale.remainingAmount = salePrice - paidAmount;
  next();
});

// Pre-update middleware to automatically calculate remaining amount
CustomerSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;
  if (update['sale.salePrice'] !== undefined || update['sale.paidAmount'] !== undefined) {
    const salePrice = Number(update['sale.salePrice']) || 0;
    const paidAmount = Number(update['sale.paidAmount']) || 0;
    update['sale.remainingAmount'] = salePrice - paidAmount;
  }
  next();
});

// Compound unique index: chassisNumber must be unique within each company
CustomerSchema.index({ companyId: 1, 'vehicle.chassisNumber': 1 }, { unique: true });

// 🔹 Model
export default mongoose.models.Customer ||
  mongoose.model<ICustomer>("Customer", CustomerSchema);
