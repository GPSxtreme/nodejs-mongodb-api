import express, { Express, Request, Response } from "express";
// Import connection from your database configuration
import { connection } from "./config/db";
import { app } from "./app";
const port: number = 6969; // default port to listen

app.get("/", (req: Request, res: Response) => {
  res.send(`Welcome to gpsxtreme's flutter todo app. Hello from server!`);
});

// Connect to MongoDB then start the Express server
connection
  .then(() => {
    app.listen(port, () => {
      console.log(
        `Welcome to gpsxtreme's flutter todo app\nServer started at http://localhost:${port}`
      );
    });
  })
  .catch((err: string) => {
    console.error("Failed to connect to MongoDB", err);
  });
