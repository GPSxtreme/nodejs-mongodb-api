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
  static async handleDeleteTodo(todoId: string) {
    const deletedTodo = await TodoModel.findByIdAndDelete(todoId);
    return deletedTodo;
  }
  static async handleUpdateTodo(todo: Todo, todoId: string) {
    return await TodoModel.findOneAndUpdate(
      { _id: todoId },
      { $set: todo },
      { new: true }
    );
  }
}
