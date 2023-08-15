import dotenv from "dotenv";
dotenv.config({ path: ".env" });
export {
  getApiEndPoint,
  PROD_API_ENDPOINT,
  DEV_API_ENDPOINT,
  USER_NAME,
  CLUSTER_ADDRESS,
  CLUSTER_NAME,
  PROJECT_NAME,
  SECRET_KEY,
  USER_PASSWORD,
  PORT,
  USER_VERIFICATION_TOKEN_SECRET,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
};
const IS_PROD = process.env.is_prod;
const PROD_API_ENDPOINT = process.env.prod_api_endpoint;
const DEV_API_ENDPOINT = process.env.dev_api_endpoint;
const USER_NAME = process.env.user_name;
const USER_PASSWORD = process.env.user_password;
const CLUSTER_NAME = process.env.cluster_name;
const CLUSTER_ADDRESS = process.env.cluster_address;
const PROJECT_NAME = process.env.project_name;
const SECRET_KEY = process.env.secret_key;
const PORT = process.env.port;
const USER_VERIFICATION_TOKEN_SECRET =
  process.env.user_verification_token_secret;
const EMAIL_USERNAME = process.env.email_username;
const EMAIL_PASSWORD = process.env.email_password;

const getApiEndPoint = (): string => {
  if (IS_PROD === "true") {
    return PROD_API_ENDPOINT!;
  } else {
    return DEV_API_ENDPOINT!;
  }
};
