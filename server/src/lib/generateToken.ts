import jwt from 'jsonwebtoken'
import { Response } from 'express'


export const generateToken = (id: string, res: Response) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET!, {expiresIn: '3d'});

    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    });

    return token;
}