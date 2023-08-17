import { UserModel, User } from "../models/userModel";
import { JwtUtils } from "../utils/jwtUtils";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import { EMAIL_PASSWORD, EMAIL_USERNAME } from "../config/environmentVariables";
import nodemailer from "nodemailer";
import { getApiEndPoint } from "../config/environmentVariables";
export { UserService, TokenData };

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  },
});

interface TokenData {
  userId?: string | null;
  email: string;
  name: string;
  country?: string;
  dob?: Date;
  isEmailVerified: boolean;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  tokenExpiresIn?: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  token?: string;
  tokenExpiresIn?: string;
}

// Function to convert User object to TokenData
function _userToTokenData(user: User, userId: string): TokenData {
  const tokenData: TokenData = {
    userId: userId,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    name: user.name,
    country: user.country,
    dob: user.dob,
  };
  return tokenData;
}

async function _sendEmailWithTemplate(
  to: string,
  subject: string,
  templateName: string,
  templateData: any
) {
  try {
    const source = fs.readFileSync(
      path.join(__dirname, "..", "..", "templates/email/", templateName),
      "utf-8"
    );
    const compiledTemplate = Handlebars.compile(source);
    const emailBody = compiledTemplate(templateData);

    const mailOptions = {
      to,
      subject,
      html: emailBody,
      attachments: [
        {
          filename: "notex_logo.svg",
          path: path.join(__dirname, "../..", "assets/notex_logo.svg"),
          cid: "logo",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Sending email failed:", error);
  }
}

class UserService {
  static async handleUserRegistration(
    user: User,
    remember?: boolean
  ): Promise<RegisterResponse> {
    //register user logic here
    try {
      const createUser = new UserModel(user);
      const newUser = await createUser.save();
      const tokenData: TokenData = {
        userId: newUser._id,
        email: newUser.email,
        name: newUser.name,
        isEmailVerified: newUser.isEmailVerified,
      };
      const token = JwtUtils.generateToken(tokenData, remember ?? false);
      console.log(`${user!.email} created account 🎂`);
      return {
        success: true,
        message: "Register successful",
        token,
        tokenExpiresIn: remember ? "3650 days" : "48 h",
      };
    } catch (error) {
      console.error(error);
      // Handle any errors that occurred during the login process
      return { success: false, message: `Register failed\nError : ${error}` };
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
          isEmailVerified: user.isEmailVerified,
        };
        // generate jwt token
        const token = JwtUtils.generateToken(tokenData, remember ?? false);
        console.log(`${user!.email} logged in`);
        return {
          success: true,
          message: "Login successful",
          token,
          tokenExpiresIn: remember ? "3650 days" : "48 h",
        };
        // You can proceed with creating a session or generating a token for authentication
      } else {
        // Passwords do not match
        return { success: false, message: "Invalid email or password" };
      }
    } catch (error) {
      console.error(error);
      // Handle any errors that occurred during the login process
      return { success: false, message: `Login failed\nError : ${error}` };
    }
  }

  static async handleSendEmailVerificationLink(userId: string) {
    try {
      const user = await UserModel.findById(userId);
      // check if user is already verified
      if (user?.isEmailVerified) {
        return {
          success: false,
          message: "user already verified",
        };
      }
      // Generate a verification token with the user's ID
      const verificationToken = await user?.generateVerificationToken();
      const verifyLink = getApiEndPoint() + `/user/verify/${verificationToken}`;
      const templateData = {
        name: user?.name,
        verificationLink: verifyLink,
        // Add more template data if needed
      };
      await _sendEmailWithTemplate(
        user?.email!,
        "Account verification",
        "userEmailVerification.hbs",
        templateData
      );
      return {
        success: true,
        message: "Verification email sent successfully",
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: `Generating email verification link failed\nError : ${error}`,
      };
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
      console.log(`${user!.email} updated their profile picture`);
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
      console.error(error);
      return {
        success: false,
        message: `Profile picture upload failed\nError : ${error}`,
      };
    }
  }
  static async updateUserData(userId: string, data: User) {
    try {
      // and iso date string is being passed from flutter
      // end so we convert it into a Date object recognized by nodejs
      data.dob = new Date(data.dob);
      const user = await UserModel.findByIdAndUpdate(userId, data, {
        new: true,
      });
      if (user === null) {
        return {
          success: false,
          message: `No such user exists`,
        };
      } else {
        const tokenData: TokenData = _userToTokenData(user, userId);
        console.log(`${user!.email} updated their profile data`);
        return {
          success: true,
          message: `Successfully updated user data`,
          token: JwtUtils.generateToken(tokenData, true),
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: `Update user data failed\nError: ${error}`,
      };
    }
  }
}
