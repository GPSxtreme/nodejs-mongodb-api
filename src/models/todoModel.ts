import { Document, Schema, Model, model, Types } from "mongoose";
export { TodoModel, Todo };

interface Todo {
  userId: unknown;
  title: string;
  body: string;
  createdTime?: Date;
  editedTime?: Date;
  expireTime?: Date;
  isCompleted?: boolean;
}
interface TodoDocument extends Document, Todo {}

const todoSchema: Schema<TodoDocument> = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "user", // Reference the User collection
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdTime: {
    type: Date,
    default: Date.now,
  },
  editedTime: {
    type: Date,
    default: Date.now,
  },
  expireTime: {
    type: Date,
    default: () => {
      // Calculate the current date
      const currentDate = new Date();

      // Add 7 days (7 * 24 * 60 * 60 * 1000 milliseconds) to the current date
      const expirationDate = new Date(
        currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
      );

      return expirationDate;
    },
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const TodoModel: Model<TodoDocument> = model<TodoDocument>("Todo", todoSchema);
