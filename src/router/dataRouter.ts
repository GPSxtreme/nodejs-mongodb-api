import { Request, Response } from "express";
import { AuthUtils } from "../utils/authUtils";
import { UserModel } from "../models/userModel";
import {
  getProfilePicture,
  uploadProfilePicture,
} from "../controller/userController";
import {
  userProfilePictureStorage,
  uploadUserProfilePicture,
} from "../middleware/upload";
const router = require("express").Router();
export { router };

userProfilePictureStorage;

router.post(
  "/uploadProfilePicture",
  AuthUtils.preAuthChecker,
  uploadUserProfilePicture.single("profilePicture"),
  uploadProfilePicture
);
router.get("/getProfilePicture", AuthUtils.preAuthChecker, getProfilePicture);
