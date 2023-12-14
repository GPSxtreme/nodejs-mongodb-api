const router = require("express").Router();
import {
  register,
  login,
  updateUserData,
  verifyUserEmail,
  sendUserEmailVerificationLink,
  sendPasswordResetLink,
  resetUserPassword,
  deleteUser,
} from "../controller/userController";
import { Response, Request } from "express";
export { router };
import { AuthUtils } from "../utils/authUtils";

router.post("/registration", register);
router.post("/login", login);
router.post("/updateUserData", AuthUtils.preAuthChecker, updateUserData);
router.get("/verify/:id", verifyUserEmail);
router.get(
  "/sendVerificationLink",
  AuthUtils.preAuthChecker,
  sendUserEmailVerificationLink
);
router.post("/accountDeletion", AuthUtils.preAuthChecker, deleteUser);
router.post("/sendPasswordResetLink", sendPasswordResetLink);
router.get("/passwordReset", (req: Request, res: Response) => {
  const { email, token } = req.query;
  res.render("passwordResetForm", { layout: false, email, token });
});
router.get("/requestAccountDeletion", (req: Request, res: Response) => {
  res.render("userAccountDeletionForm", { layout: false });
});
router.post("/resetPassword", resetUserPassword);
