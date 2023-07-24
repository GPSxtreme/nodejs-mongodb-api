import { Response } from "express";
// Import connection from your database configuration
import { connection } from "./config/db";
import { app } from "./app";
import { PORT } from "./config/environmentVariables";

const port: number = parseInt(PORT ?? process.env.PORT ?? "8000", 10); // default port to listen

app.get("/", (res: Response) => {
  res.send(`Welcome to gpsxtreme's flutter todo app. Hello from server!`);
});

// Connect to MongoDB then start the Express server
connection
  .then(() => {
    app.listen(port, () => {
      console.log(
        `Welcome to gpsxtreme's flutter todo app\nServer listening at port ${port}`
      );
    });
  })
  .catch((err: string) => {
    console.error("Failed to connect to MongoDB", err);
  });
