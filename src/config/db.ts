import mongoose, { ConnectOptions } from "mongoose";
import {
  USER_NAME,
  USER_PASSWORD,
  CLUSTER_NAME,
  CLUSTER_ADDRESS,
  PROJECT_NAME,
} from "./environmentVariables";
export { connection };

const uri = `mongodb+srv://${USER_NAME}:${USER_PASSWORD}@${CLUSTER_NAME}.${CLUSTER_ADDRESS}/${PROJECT_NAME}`;

const connection = mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connection successful"))
  .catch((error: string) => console.error("MongoDB connection failed:", error));
