import { Todo, TodoModel, TodoDocument } from "../models/todoModel";

export { TodoServices };

class TodoServices {
  static async handleAddTodo(todo: Todo) {
    const newTodo = new TodoModel(todo);
    return newTodo.save();
  }

  static async handleGetUserTodoDocs(userId: string) {
    return TodoModel.find({ userId });
  }
  static async deleteTodo(todoId: string) {
    const deletedTodo = await TodoModel.findByIdAndDelete(todoId);
    return deletedTodo;
  }
}
