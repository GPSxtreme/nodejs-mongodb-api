const router = require("express").Router();
import fs from "fs";
import {
  register,
  login,
  uploadProfilePicture,
  updateUserData,
  verifyUserEmail,
  sendUserEmailVerificationLink,
  sendPasswordResetLink,
  resetUserPassword,
} from "../controller/userController";
import { Response, Request } from "express";
export { router };
import {
  userProfilePictureStorage,
  uploadUserProfilePicture,
} from "../middleware/upload";
import { AuthUtils } from "../utils/authUtils";
import path from "path";

userProfilePictureStorage;

router.post("/registration", register);
router.post("/login", login);
router.post(
  "/uploadProfilePicture",
  AuthUtils.preAuthChecker,
  uploadUserProfilePicture.single("profilePicture"),
  uploadProfilePicture
);
router.post("/updateUserData", AuthUtils.preAuthChecker, updateUserData);
router.get("/verify/:id", verifyUserEmail);
router.get(
  "/sendVerificationLink",
  AuthUtils.preAuthChecker,
  sendUserEmailVerificationLink
);
router.post("/sendPasswordResetLink", sendPasswordResetLink);
router.get("/passwordReset", (req: Request, res: Response) => {
  const { email, token } = req.query;
  res.render("passwordResetForm", { layout: false, email, token });
});
router.post("/resetPassword", resetUserPassword);
