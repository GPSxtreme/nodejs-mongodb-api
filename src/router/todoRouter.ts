const router = require("express").Router();
import { addTodo, getTodos } from "../controller/todoController";
export { router };

router.post("/addTodo", addTodo);
router.get("/getTodos", getTodos);
