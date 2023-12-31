import { Request, Response } from "express";
import { UserService } from "../services/userServices";
import { User, UserModel } from "../models/userModel";
import { JwtUtils } from "../utils/jwtUtils";
import { JwtPayload } from "jsonwebtoken";
import path from "path";
export {
  register,
  login,
  uploadProfilePicture,
  updateUserData,
  verifyUserEmail,
  sendUserEmailVerificationLink,
  sendPasswordResetLink,
  resetUserPassword,
  getProfilePicture,
  deleteUser,
};

const register = async (req: Request, res: Response) => {
  try {
    const newUser: User = req.body;
    await UserService.handleUserRegistration(newUser, req.body.remember).then(
      (response) => {
        res.status(response.success ? 200 : 500).send(response);
      }
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: false, message: `Registration Failed , ${error}` });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password, remember } = req.body;
    await UserService.handleLogin(email, password, remember).then(
      (response) => {
        res.status(response.success ? 200 : 500).send(response);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: `Login Failed , ${error}` });
  }
};

const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    if (req.file == null) {
      return res.status(404).send({
        status: false,
        message: "File not uploaded",
      });
    } else {
      const filePath = req.file!.path;
      // save file to server and update the database with path of saved image
      UserService.handleProfilePictureUpload(req.userId!, filePath).then(
        (response) => {
          res.status(response.success ? 200 : 500).send(response);
        }
      );
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: false, message: `Upload Failed , ${error}` });
  }
};

const getProfilePicture = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const user: any = await UserModel.findOne({ _id: userId }).exec();

  if (!user || !user.profilePicture) {
    return res.status(404).send({
      status: false,
      message: "Profile picture not found",
    });
  }
  res.setHeader("Content-Type", user.profilePicture.contentType);
  res.send(user.profilePicture.data);
};

const updateUserData = async (req: Request, res: Response) => {
  try {
    const updateData: User = req.body;
    await UserService.handleUpdateUserData(req.userId!, updateData).then(
      (response) => {
        res.status(response!.success ? 200 : 500).send(response);
      }
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: false, message: `Update Failed , ${error}` });
  }
};

const sendUserEmailVerificationLink = async (req: Request, res: Response) => {
  try {
    await UserService.handleSendEmailVerificationLink(req.userId!).then(
      (response) => {
        res.status(response!.success ? 200 : 500).send(response);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: false,
      message: `Failed to send verificationLink , ${error}`,
    });
  }
};

const sendPasswordResetLink = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await UserService.handleSendPasswordResetLink(email).then((response) => {
      res.status(response!.success ? 200 : 500).send(response);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: false,
      message: `Failed to send password reset link , ${error}`,
    });
  }
};

const verifyUserEmail = async (req: Request, res: Response) => {
  const token = req.params.id;
  if (!token) {
    return res.status(422).send({
      success: false,
      message: "Missing Token",
    });
  }
  // verify the token from the url
  let payload = null;
  try {
    payload = JwtUtils.verifyEmailToken(token) as JwtPayload;
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error,
    });
  }
  // Find user with matching ID
  const user = await UserModel.findById(payload.id);
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User does not  exists",
    });
  }
  // Update user verification status to true
  if (!user.isEmailVerified) {
    user.isEmailVerified = true;
    await user.save();
  }
  return res
    .status(200)
    .sendFile(
      path.join(
        __dirname,
        "..",
        "..",
        "templates/html/userEmailVerificationSuccess.html"
      )
    );
};

const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { email, token, newPassword } = req.body;
    await UserService.handleResetPassword(email, token, newPassword).then(
      (response) => {
        res.status(response.success ? 200 : 500).send(response);
      }
    );
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Failed to reset password.
        Error : ${error}`,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await UserService.handleUserDeletion(email).then((response) => {
      res.status(response.success ? 200 : 500).send(response);
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Failed to delete user account data.
        Error : ${error}`,
    });
  }
};
