import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  secondName: string;
  email: string;
  city: string;
  country: string;
  pin: string;
  confirmPin: string;
  recoveryEmail: string;
  image?: string;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  secondName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  city: String,
  country: String,
  pin: { type: String, required: true },
  confirmPin: { type: String, required: true },
  recoveryEmail: { type: String, lowercase: true, trim: true },
  image: String,
});

// Pre-save middleware to ensure emails are always lowercase
UserSchema.pre('save', function(next) {
  console.log('Pre-save middleware triggered');
  console.log('Original email:', this.email);
  console.log('Original recoveryEmail:', this.recoveryEmail);
  
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
    console.log('Processed email:', this.email);
  }
  if (this.recoveryEmail) {
    this.recoveryEmail = this.recoveryEmail.toLowerCase().trim();
    console.log('Processed recoveryEmail:', this.recoveryEmail);
  }
  next();
});

// Also add pre-validate hook for additional safety
UserSchema.pre('validate', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.recoveryEmail) {
    this.recoveryEmail = this.recoveryEmail.toLowerCase().trim();
  }
  next();
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
