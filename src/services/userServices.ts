import { UserModel } from "../models/userModel";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/environmentVariables";
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
  static async registerUser(email: string, password: string, name?: string) {
    //register user logic here
    try {
      const createUser = new UserModel({ email, password, name });
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
}
