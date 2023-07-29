const router = require("express").Router();
import { addTodo, getTodos, deleteTodo } from "../controller/todoController";
export { router };

router.post("/addTodo", addTodo);
router.get("/getTodos", getTodos);
router.get("/deleteTodo", deleteTodo);
