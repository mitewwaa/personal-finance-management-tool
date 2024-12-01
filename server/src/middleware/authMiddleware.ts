import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: any) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }
        console.log(decoded.userId);
        req.body.userId = decoded.userId; 
        console.log(req.body.userId);
        next();
    });
};

