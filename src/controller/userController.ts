import { Request, Response } from "express";
import { UserService } from "../services/userServices";
import { User } from "../models/userModel";
export { register, login, uploadProfilePicture, updateUserData };

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

const updateUserData = async (req: Request, res: Response) => {
  try {
    const updateData: User = req.body;
    await UserService.updateUserData(req.userId!, updateData).then(
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
