import bcrypt from "bcrypt";
import { User } from "./model/user"
import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
router.post("/users", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});