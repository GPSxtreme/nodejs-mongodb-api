const router = require("express").Router();
import {
  register,
  login,
  uploadProfilePicture,
  updateUserData,
  verifyUserEmail,
  sendUserEmailVerificationLink,
} from "../controller/userController";
export { router };
import {
  userProfilePictureStorage,
  uploadUserProfilePicture,
} from "../middleware/upload";
import { AuthUtils } from "../utils/authUtils";

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
