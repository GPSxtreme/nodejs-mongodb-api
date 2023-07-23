import { Request, Response } from "express";
import { TodoServices } from "../services/todoServices";
import { Todo } from "../models/todoModel";
import { AuthUtils } from "../utils/authUtils";
export { addTodo, getTodos };

function checkIfAuthenticated(req: Request): boolean {
  const authToken = AuthUtils.extractAuthToken(req);
  if (!authToken) {
    return false;
  }
  const userId = AuthUtils.isAuthenticated(authToken);

  if (!userId) {
    return false;
  }
  // User is authenticated, continue with the request
  return true;
}

const addTodo = async (req: Request, res: Response) => {
  try {
    const todo: Todo = req.body;
    const isAuthenticated: boolean = checkIfAuthenticated(req);
    if (isAuthenticated) {
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
    const isAuthenticated: boolean = checkIfAuthenticated(req);
    if (isAuthenticated) {
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
