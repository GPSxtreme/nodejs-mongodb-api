import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { router as UserRouter } from "./router/userRouter";
import { router as TodoRouter } from "./router/todoRouter";
import { router as NoteRouter } from "./router/noteRouter";
import { router as DataRouter } from "./router/dataRouter";
export { app };

const app = express();
// Serve static files
app.use("/assets", express.static(path.join(__dirname, "..", "assets/")));
app.use("/assets", express.static(path.join(__dirname, "..", "templates/")));
// Use body-parser middleware
app.use(bodyParser.json());
app.use("/user", UserRouter);
app.use("/todo", TodoRouter);
app.use("/note", NoteRouter);
app.use("/data", DataRouter);
