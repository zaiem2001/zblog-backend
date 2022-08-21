import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../environment.js";

export const generateToken = (payload: { _id: string }) => {
  const token = jwt.sign(payload, JWT_SECRET!);

  return token;
};
