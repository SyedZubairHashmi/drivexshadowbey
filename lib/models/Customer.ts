import mongoose, { Schema, Document } from "mongoose";

// 🔹 Payment Interface for installment tracking
export interface IPayment {
  _id?: mongoose.Types.ObjectId;
  paymentDate: Date;
  amountPaid: number; // Amount paid in this installment
  remainingAfterPayment: number; // Remaining balance after this payment
  totalPaidUpToDate: number; // Total paid amount up to this payment
  paymentMethod: {
    type: "Cash" | "Bank" | "Cheque" | "BankDeposit";
    details: {
      bankName?: string;
      ibanNo?: string;
      accountNo?: string;
      chequeNo?: string;
      chequeClearanceDate?: Date;
      slipNo?: string;
    };
  };
  status: "Completed" | "Pending" | "Failed";
  installmentNumber?: number; // Track which installment this is (1st, 2nd, etc.)
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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
      paidAmount: number; // Total amount paid across all installments
      remainingAmount: number; // Calculated automatically: salePrice - paidAmount
      paymentStatus: "Completed" | "Pending";
      note?: string;
      document?: string;
    };
  payments: IPayment[]; // 🆕 All installment records
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
      paymentStatus: {
        type: String,
        enum: ["Completed", "Pending"],
        default: "Pending",
      },
      note: { type: String }, // optional
      document: { type: String }, // file path or URL
    },
    
    // 🆕 Payment History Array - Enhanced installment tracking
    payments: [{
      paymentDate: { type: Date, required: true, default: Date.now },
      amountPaid: { type: Number, required: true }, // Amount paid in this installment
      remainingAfterPayment: { type: Number, required: true }, // Remaining balance after this payment
      totalPaidUpToDate: { type: Number, required: true }, // Total paid amount up to this payment
      installmentNumber: { type: Number }, // Track which installment this is (1st, 2nd, etc.)
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
      status: {
        type: String,
        enum: ["Completed", "Pending", "Failed"],
        default: "Completed",
      },
      note: { type: String },
    }],
  },
  { timestamps: true }
);

// Pre-save middleware to automatically calculate remaining amount and update payment tracking
CustomerSchema.pre('save', function(next) {
  const doc = this as any;
  const salePrice = Number(doc.sale.salePrice) || 0;
  
  // Calculate total paid amount from ALL payments (not just completed ones)
  const totalPaidFromPayments = doc.payments
    ?.reduce((sum: number, payment: any) => sum + (Number(payment.amountPaid) || 0), 0) || 0;
  
  // Update overall sale amounts
  doc.sale.paidAmount = totalPaidFromPayments;
  doc.sale.remainingAmount = salePrice - totalPaidFromPayments;
  
  // Update payment status based on remaining amount
  if (doc.sale.remainingAmount <= 0) {
    doc.sale.paymentStatus = "Completed";
  } else {
    doc.sale.paymentStatus = "Pending";
  }
  
  // Update payment tracking fields for each payment
  if (doc.payments && doc.payments.length > 0) {
    let runningTotal = 0;
    doc.payments.forEach((payment: any, index: number) => {
      runningTotal += Number(payment.amountPaid) || 0;
      payment.totalPaidUpToDate = runningTotal;
      payment.remainingAfterPayment = salePrice - runningTotal;
      payment.installmentNumber = index + 1;
    });
  }
  
  next();
});


// Post-update middleware to recalculate amounts when payments are updated
CustomerSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) {
    const docAny = doc as any;
    const salePrice = Number(docAny.sale.salePrice) || 0;
    
    // Calculate total paid amount from ALL payments (not just completed ones)
    const totalPaidFromPayments = docAny.payments
      ?.reduce((sum: number, payment: any) => sum + (Number(payment.amountPaid) || 0), 0) || 0;
    
    const paidAmount = totalPaidFromPayments;
    const remainingAmount = salePrice - paidAmount;
    
    // Determine payment status
    let paymentStatus = "Pending";
    if (remainingAmount <= 0) {
      paymentStatus = "Completed";
    }
    
    // Update payment tracking fields for each payment
    if (docAny.payments && docAny.payments.length > 0) {
      let runningTotal = 0;
      docAny.payments.forEach((payment: any, index: number) => {
        runningTotal += Number(payment.amountPaid) || 0;
        payment.totalPaidUpToDate = runningTotal;
        payment.remainingAfterPayment = salePrice - runningTotal;
        payment.installmentNumber = index + 1;
      });
    }
    
    // Update the document if amounts have changed
    if (docAny.sale.paidAmount !== paidAmount || 
        docAny.sale.remainingAmount !== remainingAmount || 
        docAny.sale.paymentStatus !== paymentStatus) {
      await docAny.updateOne({
        'sale.paidAmount': paidAmount,
        'sale.remainingAmount': remainingAmount,
        'sale.paymentStatus': paymentStatus,
        'payments': docAny.payments
      });
    }
  }
});


// Compound unique index: chassisNumber must be unique within each company
CustomerSchema.index({ companyId: 1, 'vehicle.chassisNumber': 1 }, { unique: true });


// 🔹 Model
// Clear any existing model to prevent cache issues
if (mongoose.models.Customer) {
  delete mongoose.models.Customer;
}

export default mongoose.model<ICustomer>("Customer", CustomerSchema);
