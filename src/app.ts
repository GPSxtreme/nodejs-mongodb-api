import express from "express";
import bodyParser from "body-parser";
import { router as UserRouter } from "./router/userRouter";
import { router as TodoRouter } from "./router/todoRouter";
import { router as NoteRouter } from "./router/noteRouter";
export { app };

const app = express();

// Use body-parser middleware
app.use(bodyParser.json());
app.use("/user", UserRouter);
app.use("/todo", TodoRouter);
app.use("/note", NoteRouter);
