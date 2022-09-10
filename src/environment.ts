import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 4000;

export const MONGO_URL =
  process.env.ENVIRONMENT === "prod"
    ? process.env.MONGO_URL_PROD
    : process.env.MONGO_URL;

export const JWT_SECRET = process.env.JWT_SECRET;
export const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
