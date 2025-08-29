import mongoose, { Schema, Document } from "mongoose";

interface Investor extends Document {
  name: string;
  contactNumber: string;
  emailAddress: string;
  investorId: string; // CNIC / ID
  investAmount: number;
  percentageShare: number;
  amountPaid: number;
  remainingAmount: number; // Calculated automatically: investAmount - amountPaid
  paymentDate: Date;
  batchNo: string;
  paymentMethod: {
    type: "Cash" | "Bank" | "Cheque" | "BankDeposit";
    details: {
      // For Cash → no extra fields
      bankName?: string;     // For Bank, Cheque, BankDeposit
      ibanNo?: string;       // For Bank
      accountNo?: string;    // For Bank
      chequeNo?: string;     // For Cheque
      slipNo?: string;       // For BankDeposit
    };
  };
}

const InvestorSchema: Schema = new Schema<Investor>(
  {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    emailAddress: { type: String, required: true },
    investorId: { type: String, required: true }, // CNIC or custom ID
    investAmount: { type: Number, required: true },
    percentageShare: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    remainingAmount: { type: Number, required: false }, // Will be calculated automatically
    paymentDate: { type: Date, default: Date.now },
    batchNo: { type: String },

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
        slipNo: { type: String },
      },
    },
  },
  { timestamps: true }
);

// Pre-save middleware to automatically calculate remaining amount
InvestorSchema.pre('save', function(next) {
  const investAmount = Number(this.investAmount) || 0;
  const amountPaid = Number(this.amountPaid) || 0;
  
  this.remainingAmount = investAmount - amountPaid;
  next();
});

// Pre-update middleware to automatically calculate remaining amount
InvestorSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;
  if (update.investAmount !== undefined || update.amountPaid !== undefined) {
    const investAmount = Number(update.investAmount) || 0;
    const amountPaid = Number(update.amountPaid) || 0;
    update.remainingAmount = investAmount - amountPaid;
  }
  next();
});

export default mongoose.models.Investor ||
  mongoose.model<Investor>("Investor", InvestorSchema);
