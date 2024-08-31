import mongoose, { Schema } from "mongoose";

export interface User {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  verifyCode: string;
  verifyCodeExpiry: string;
  isVerified: boolean;
}

// Schema for User 
const UserSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is Required!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required!"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is Required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is Required"],
  },
  verifyCodeExpiry: {
    type: String,
    required: [true, "Verify code expiry is Required"],
  },
  isVerified: {
    type: Boolean,
  },
});

const userModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model("User", UserSchema);

export default userModel;
