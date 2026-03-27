import 'dotenv/config';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db';
import { generateToken } from '../lib/generateToken';


// function hashToken(token: string) {
//     return crypto.createHash('sha256').update(token).digest('hex');
// }

// function generateAccessToken(payload: { id: string; username: string }) {
//     return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
// }

// function generateRefreshToken(adminId: string) {
//     const token = crypto.randomBytes(48).toString('hex');
//     const tokenHash = hashToken(token);
//     const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
//     return { token, tokenHash, expiresAt };
// }

// function setRefreshCookie(res: Response, token: string) {
//     res.cookie(REFRESH_COOKIE_NAME, token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//         path: REFRESH_TOKEN_PATH,
//         maxAge: REFRESH_TOKEN_TTL_MS,
//     });
// }

// export async function refreshToken(req: Request, res: Response) {
//     const reqWithCookies = req as RequestWithCookies;
//     const refreshToken = reqWithCookies.cookies?.[REFRESH_COOKIE_NAME];

//     if (!refreshToken) {
//         res.status(401).json({ error: 'Refresh token missing' });
//         return;
//     }

//     const tokenHash = hashToken(refreshToken);

//     try {
//         const storedToken = await prisma.refreshToken.findUnique({
//             where: { tokenHash },
//             include: { admin: true },
//         });

//         if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
//             res.clearCookie(REFRESH_COOKIE_NAME, {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production',
//                 sameSite: 'strict',
//                 path: REFRESH_TOKEN_PATH,
//             });
//             res.status(401).json({ error: 'Invalid or expired refresh token' });
//             return;
//         }

//         await prisma.refreshToken.update({
//             where: { tokenHash },
//             data: { revokedAt: new Date() },
//         });

//         const { token: newRefreshToken, tokenHash: newRefreshHash, expiresAt } = generateRefreshToken(storedToken.adminId);

//         await prisma.refreshToken.create({
//             data: {
//                 tokenHash: newRefreshHash,
//                 adminId: storedToken.adminId,
//                 expiresAt,
//             },
//         });

//         const accessToken = generateAccessToken({ id: storedToken.admin.id, username: storedToken.admin.username });

//         setRefreshCookie(res, newRefreshToken);

//         res.json({
//             token: accessToken,
//             admin: {
//                 id: storedToken.admin.id,
//                 username: storedToken.admin.username,
//             },
//         });
//     } catch (error) {
//         console.error('Refresh error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

export async function login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
    }

    try {
        const admin = await prisma.admin.findUnique({
            where: { username },
        });

        if (!admin) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        generateToken(admin.id, res);

        res.status(200).json({
            id: admin.id,
            username: admin.username,
        })

       
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function logout(req: Request, res: Response) {
    
    try {
        res.cookie('jwt', "", {maxAge: 0});
        res.status(200).json({ message: 'Logged out' });
    } catch (error) {
        console.log('Error in logout controller', error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({message: 'Internal Server Error'});
    }
}

export async function session(req: Request, res: Response) {
    const token = req.cookies?.jwt;

    if (!token) {
        res.status(200).json({ authenticated: false });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        if (!decoded?.id) {
            res.status(200).json({ authenticated: false });
            return;
        }

        const admin = await prisma.admin.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                username: true,
            },
        });

        if (!admin) {
            res.status(200).json({ authenticated: false });
            return;
        }

        res.status(200).json({
            authenticated: true,
            admin,
        });
    } catch {
        res.status(200).json({ authenticated: false });
    }
}
