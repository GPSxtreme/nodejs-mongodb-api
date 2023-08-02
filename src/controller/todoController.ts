import { Request, Response } from "express";
import { TodoServices } from "../services/todoServices";
import { Todo } from "../models/todoModel";
export { addTodo, getTodos, deleteTodo };

const addTodo = async (req: Request, res: Response) => {
  try {
    const todo: Todo = req.body;
    todo.userId = req.userId;
    await TodoServices.handleAddTodo(todo).then((_) => {
      return res
        .status(200)
        .json({ success: true, message: "Successfully added the task" });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: `failed adding the task , ${error}` });
  }
};

const getTodos = async (req: Request, res: Response) => {
  try {
    await TodoServices.handleGetUserTodoDocs(req.userId!).then((docs) => {
      return res.status(200).json({
        success: true,
        message: "Successfully fetched tasks",
        todos: docs,
      });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: `failed fetching tasks, ${error}` });
  }
};

const deleteTodo = async (req: Request, res: Response) => {
  try {
    const todoId = req.query.todoId as string;
    await TodoServices.deleteTodo(todoId).then((doc) => {
      return res.status(200).json({
        success: true,
        message: "Successfully deleted todo",
        todo: doc,
      });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: `failed deleting todo, ${error}` });
  }
};
