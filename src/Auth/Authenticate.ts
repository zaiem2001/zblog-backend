import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../environment.js";

// type MiddlewareFn = (req: Request, res: Response, next: NextFunction) => any;

export const Authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const headers = req.headers.authorization;

  if (headers && headers.startsWith("Bearer")) {
    try {
      const token = headers.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET!);

      req.body = { ...req.body, auth: decoded };
      return next();
    } catch (error) {
      req.body = { ...req.body, auth: false };
      return next();
    }
  }
  req.body = { ...req.body, auth: false };
  next();
};
