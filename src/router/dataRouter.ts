import { Request, Response } from "express";
import { AuthUtils } from "../utils/authUtils";
import path from "path";

const router = require("express").Router();
export { router };

router.get(
  "/getProfilePicture",
  AuthUtils.preAuthChecker,
  (req: Request, res: Response) => {
    const userId = req.userId!;
    const imagePath = path.resolve(
      __dirname,
      "..",
      "..",
      "uploads",
      "userProfilePictures",
      `${userId}.png`
    );
    res.sendFile(imagePath);
  }
);
