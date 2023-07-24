import dotenv from "dotenv";
dotenv.config({ path: ".env" });
export {
  USER_NAME,
  CLUSTER_ADDRESS,
  CLUSTER_NAME,
  PROJECT_NAME,
  SECRET_KEY,
  USER_PASSWORD,
  PORT,
};

const USER_NAME = process.env.user_name;
const USER_PASSWORD = process.env.user_password;
const CLUSTER_NAME = process.env.cluster_name;
const CLUSTER_ADDRESS = process.env.cluster_address;
const PROJECT_NAME = process.env.project_name;
const SECRET_KEY = process.env.secret_key;
const PORT = process.env.port;
