import mongoose, { Document, Model, model } from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { USER_VERIFICATION_TOKEN_SECRET } from "../config/environmentVariables";
import jwt from "jsonwebtoken";
export { UserModel, User };
const { Schema } = mongoose;

interface User {
  email: string;
  password: string;
  name: string;
  country: string;
  dob: Date;
  isEmailVerified: boolean;
  profilePicture: unknown;
}

interface UserDocument extends Document, User {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateVerificationToken(): Promise<string>;
}

// Function to generate a user-friendly unique name
const generateUniqueName = (): string => {
  const uniquePart = "User"; // Use the part of the email before '@'
  const randomPart = uuidv4().split("-")[0]; // Use the first part of the UUIDv4
  return `${uniquePart}_${randomPart}`;
};

const userSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Email is Required"],
      unique: true,
    },
    profilePicture: {
      data: Buffer,
      contentType: String,
    },
    name: {
      type: String,
      trim: true,
      default: generateUniqueName,
    },
    country: {
      type: String,
    },
    dob: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password should be at least 6 characters long"],
    },
  },
  {
    timestamps: true,
  }
);
// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password along with the new salt
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Override the plaintext password with the hashed one
    user.password = hashedPassword;
    next();
  } catch (error: any) {
    return next(error);
  }
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.generateVerificationToken = function () {
  const user = this;
  const verificationToken = jwt.sign(
    { id: user._id },
    USER_VERIFICATION_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );
  return verificationToken;
};

// user model
const UserModel: Model<UserDocument> = model<UserDocument>("user", userSchema);
