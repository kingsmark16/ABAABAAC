import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { prisma } from "../lib/db";

declare global {
    namespace Express {
        interface Request {
            id?: string;
        }
    }
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message: 'Unauthorized - No token provided'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        if(!decoded.id){
            return res.status(401).json({message: 'Invalid Token'});
        }

        const admin = await prisma.admin.findUnique({
            select: { 
                id: true,
                username: true,
             },
            where: { id: decoded.id }
        })

        if(!admin){
            return res.status(401).json({message: 'Admin not found'});
        }

        req.id = admin.id;
        next();

    } catch (error) {
        res.status(401).json({message: 'Unauthorized - Invalid token'});
    }
}