import { Request, Response } from "express";
import { UserService } from "../services/userServices";
export { register, login };

const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    await UserService.registerUser(email, password);
    res
      .status(200)
      .send({ status: true, message: "User registered successfully" });
  } catch (error) {
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
    res.status(500).send({ status: false, message: `Login Failed , ${error}` });
  }
};
