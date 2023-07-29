import { Request, Response } from "express";
import { TodoServices } from "../services/todoServices";
import { Todo } from "../models/todoModel";
import { AuthUtils, check_is_auth_return } from "../utils/authUtils";
export { addTodo, getTodos, deleteTodo };

const addTodo = async (req: Request, res: Response) => {
  try {
    const todo: Todo = req.body;
    const userAuthCheck: check_is_auth_return =
      AuthUtils.checkIfAuthenticated(req);
    if (userAuthCheck[0]) {
      todo.userId = userAuthCheck[1];
      await TodoServices.handleAddTodo(todo).then((_) => {
        return res
          .status(200)
          .json({ status: true, message: "Successfully added the task" });
      });
    } else {
      return res
        .status(401)
        .json({ status: false, message: "User not authenticated" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: `failed adding the task , ${error}` });
  }
};

const getTodos = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const isAuthenticated: check_is_auth_return =
      AuthUtils.checkIfAuthenticated(req);
    if (isAuthenticated[0]) {
      await TodoServices.handleGetUserTodoDocs(userId).then((docs) => {
        return res.status(200).json({
          status: true,
          message: "Successfully fetched tasks",
          todos: docs,
        });
      });
    } else {
      return res
        .status(401)
        .json({ status: false, message: "User not authenticated" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: `failed fetching tasks, ${error}` });
  }
};

const deleteTodo = async (req: Request, res: Response) => {
  try {
    const todoId = req.query.todoId as string;
    const isAuthenticated: check_is_auth_return =
      AuthUtils.checkIfAuthenticated(req);
    if (isAuthenticated[0]) {
      await TodoServices.deleteTodo(todoId).then((doc) => {
        return res.status(200).json({
          status: true,
          message: "Successfully deleted todo",
          todo: doc,
        });
      });
    } else {
      return res
        .status(401)
        .json({ status: false, message: "User not authenticated" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: `failed deleting todo, ${error}` });
  }
};
