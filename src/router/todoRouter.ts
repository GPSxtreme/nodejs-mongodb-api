const router = require("express").Router();
import {
  addTodo,
  getTodos,
  deleteTodo,
  updateTodo,
} from "../controller/todoController";
import { AuthUtils } from "../utils/authUtils";
export { router };

router.post("/addTodo", AuthUtils.preAuthChecker, addTodo);
router.get("/getTodos", AuthUtils.preAuthChecker, getTodos);
router.get("/deleteTodo", AuthUtils.preAuthChecker, deleteTodo);
router.post("/updateTodo", AuthUtils.preAuthChecker, updateTodo);
