// import express from 'express';
// import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
// import userRoutes from './routes';

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Connect your MongoDB URI
// const DB_URI: string = 'mongodb+srv://mhatre:rashmita@cluster0.vfkv4.mongodb.net/users1'; // Update connection string accordingly

// app.use(bodyParser.json());
// app.use('/users', userRoutes);

// // Connect to MongoDB
// const connectDB = async () => {
//     try {
//         await mongoose.connect(DB_URI);
//         console.log('MongoDB connected');
//         app.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`);
//         });
//     } catch (error) {
//         console.error('MongoDB connection error:', error);
//     }
// };
// connectDB();

// import express from 'express';
// import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
// import userRoutes from './routes';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// const DB_URI: string = 'mongodb+srv://mhatre:rashmita@cluster0.vfkv4.mongodb.net/users2'

// app.use(bodyParser.json());
// app.use('/auth', userRoutes); // Use the updated user routes

// const connectDB = async () => {
//     try {
//         await mongoose.connect(DB_URI);
//         console.log('MongoDB connected');
//         app.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`);
//         });
//     } catch (error) {
//         console.error('MongoDB connection error:', error);
//     }
// };

// connectDB();
// import express from 'express';
// import session from 'express-session';
// import MongoStore from 'connect-mongo';
// import { connectDB } from './dbconnection';
// import authRoutes from './useroutes';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(session({
//     secret: process.env.SESSION_SECRET as string,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//         mongoUrl: process.env.MONGODB_URI,
//     }),
//     cookie: { maxAge: 180 * 60 * 1000 } // 3 hours
// }));

// // Routes
// app.use('/api/auth', authRoutes);

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import session from "express-session";
import dotenv from "dotenv";
import authRoutes from "./useroutes";
import MongoStore from 'connect-mongo'
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(
    session({
        secret:"fallbacksecret",
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: "mongodb+srv://mhatre:rashmi@cluster0.vfkv4.mongodb.net/roletable",
        }),
        cookie: { maxAge: 180 * 60 * 1000 }
    })
);

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running!");
});

// Database Connection
mongoose
    .connect(process.env.MONGODB_URI || "mongodb+srv://mhatre:rashmi@cluster0.vfkv4.mongodb.net/roletable")
    .then(() => console.log("connected to MongoDB"))
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    });

// Routes
app.use("/auth", authRoutes);

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack || err.message);
    res.status(500).json({ error: err.message || "Something went wrong!" });
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




