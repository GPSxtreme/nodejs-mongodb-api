const router = require("express").Router();
import { register, login } from "../controller/userController";
export { router };

router.post("/registration", register);
router.post("/login", login);
