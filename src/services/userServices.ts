import { UserModel, User } from "../models/userModel";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/environmentVariables";
import fs from "fs";
export { UserService };

type TokenData = {
  userId?: number | null;
  email: string;
  name: string;
};

interface LoginResponse {
  success: boolean;
  message: string;
  tokenData?: TokenData; // TODO:  remove in production
  token?: string;
  tokenExpiresIn?: string;
}

class UserService {
  static async handleUserRegistration(user: User) {
    //register user logic here
    try {
      const createUser = new UserModel(user);
      return await createUser.save();
    } catch (err) {
      throw err;
    }
  }

  static async handleLogin(
    email: string,
    password: string,
    remember?: boolean
  ): Promise<LoginResponse> {
    try {
      // Find the user by email
      const user = await UserModel.findOne({ email });

      if (!user) {
        // User with the given email does not exist
        return { success: false, message: "Invalid email or password" };
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordMatch = await user.comparePassword(password);

      if (isPasswordMatch) {
        // Passwords match, user is authenticated
        const tokenData: TokenData = {
          userId: user._id,
          email: user.email,
          name: user.name,
        };
        // generate jwt token
        const tokenExpiryTime: string = remember ? "3650 days" : "48 h";
        const token = jwt.sign(tokenData, SECRET_KEY as string, {
          expiresIn: tokenExpiryTime, // Token expires in 1 hour
        });
        return {
          success: true,
          message: "Login successful",
          tokenData, //TODO: remove in production
          token,
          tokenExpiresIn: tokenExpiryTime,
        };
        // You can proceed with creating a session or generating a token for authentication
      } else {
        // Passwords do not match
        return { success: false, message: "Invalid email or password" };
      }
    } catch (error) {
      // Handle any errors that occurred during the login process
      return { success: false, message: `Login failed\nError : ${error}` };
    }
  }
  static async handleProfilePictureUpload(userId: string, filePath: any) {
    try {
      const img = fs.readFileSync(filePath);
      const encode_img = img.toString("base64");
      const final_img = {
        contentType: "image/png", // Assuming the uploaded file is PNG
        data: Buffer.from(encode_img, "base64"),
      };
      const user = await UserModel.findOne({ _id: userId }).exec();
      if (!user) {
        // Handle user not found
        return {
          success: false,
          message: `Profile picture upload failed\nError: User not found`,
        };
      }
      user.profilePicture = final_img;
      const updatedUser = await user.save();
      console.log("Updated User:", updatedUser.id);
      if (!updatedUser) {
        // Handle user not found
        return {
          success: false,
          message: `Profile picture upload failed\nError : user not found`,
        };
      }
      return {
        success: true,
        message: `Profile picture upload success`,
      };
    } catch (error) {
      // Handle error while uploading and saving profile picture
      return {
        success: false,
        message: `Profile picture upload failed\nError : ${error}`,
      };
    }
  }
}
