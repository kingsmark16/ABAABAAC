import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import dropboxAuth from './routes/dropboxAuth.routes';
import adminRoutes from './routes/admin.routes';
import publicRoutes from './routes/public.routes';

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean) || [
    'http://localhost:5173',
    'http://192.168.1.141:5173',
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser tools and same-origin requests with no Origin header.
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});


app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dropbox-auth', dropboxAuth);
app.use('/api/public', publicRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});