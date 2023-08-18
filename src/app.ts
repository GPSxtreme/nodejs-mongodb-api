import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { engine } from "express-handlebars"; // Import Handlebars
import { router as UserRouter } from "./router/userRouter";
import { router as TodoRouter } from "./router/todoRouter";
import { router as NoteRouter } from "./router/noteRouter";
import { router as DataRouter } from "./router/dataRouter";
export { app };

const app = express();
// Set up Handlebars view engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "..", "views"));

// Serve static files
app.use("/templates", express.static(path.join(__dirname, "..", "templates/")));
app.use(express.static(path.join(__dirname, "..", "public/")));
// Use body-parser middleware
app.use(bodyParser.json());
app.use("/user", UserRouter);
app.use("/todo", TodoRouter);
app.use("/note", NoteRouter);
app.use("/data", DataRouter);
