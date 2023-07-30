import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { SECRET_KEY } from "../config/environmentVariables";
import { NextFunction } from "express-serve-static-core";
export { AuthUtils, check_is_auth_return };

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

type check_is_auth_return = [boolean, string];

class AuthUtils {
  static preAuthChecker(req: Request, res: Response, next: NextFunction) {
    const [isAuthenticated, userId] = AuthUtils.checkIfAuthenticated(req);
    if (!isAuthenticated) {
      return res
        .status(401)
        .json({ status: false, message: "User not authenticated" });
    }
    req.userId = userId; // Attach the userId to the request object for further processing
    next();
  }
  static checkIfAuthenticated(req: Request): check_is_auth_return {
    const authToken = AuthUtils.extractAuthToken(req);
    if (!authToken) {
      return [false, "null"];
    }
    const userId = AuthUtils.isAuthenticated(authToken);
    if (!userId) {
      return [false, "user not authenticated"];
    }
    // User is authenticated, continue with the request
    return [true, userId];
  }

  static isAuthenticated(token: string): string | null {
    try {
      // Verify the JWT token using the secret key
      const decodedToken: any = jwt.verify(token, SECRET_KEY as string);

      // The decoded token will contain the user ID (you can customize the token payload when generating the JWT during login)
      const userId = decodedToken.userId;

      // Check if the token has expired
      const currentTimestamp = Math.floor(Date.now() / 1000); // Convert to seconds
      if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
        return null; // Token has expired
      }

      // Return the userId
      return userId;
    } catch (error) {
      // If the token verification fails or token has expired, return null
      return null;
    }
  }

  static extractAuthToken(req: Request): string | null {
    const token = req.header("Authorization");

    if (!token || !token.trim().startsWith("Bearer")) {
      return null;
    }

    return token.slice(7).trim();
  }
}
