import jwt from "jsonwebtoken";
import { TokenData } from "../services/userServices";
import { SECRET_KEY } from "../config/environmentVariables";

export { JwtUtils };

class JwtUtils {
  static generateToken(tokenData: TokenData, remember: boolean): string {
    // generate jwt token
    const tokenExpiryTime: string = remember ? "3650 days" : "48 h";
    const token = jwt.sign(tokenData, SECRET_KEY as string, {
      expiresIn: tokenExpiryTime, // Token expires in 1 hour
    });
    return token;
  }
}
