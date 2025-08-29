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
  email: { type: String, required: true, unique: true },
  city: String,
  country: String,
  pin: { type: String, required: true },
  confirmPin: { type: String, required: true },
  recoveryEmail: String,
  image: String,
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
