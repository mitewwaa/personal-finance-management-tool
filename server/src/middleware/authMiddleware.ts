<<<<<<< HEAD
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserData from "../shared/interfaces/UserData";
=======
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
>>>>>>> f50377c64bc458d942965703ef89bb28ce153f33

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    req.body.userId = decoded.userId;
    req.body.email = decoded.email;
    req.body.name = decoded.name;
    next();
  });
};
