// import express, { Request, Response } from 'express';
// import User, { IUser } from './model/user';
// import { Session } from 'express-session';

// interface ISession {
//     userId: string;
//     username: string;
//     role: string;
// }

// const router = express.Router();

// // Register User
// router.post('/register', async (req: Request, res: Response) => {
//     const { username, password, role } = req.body;
//     const user = new User({ username, password, role });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
// });

// // Log in User
// router.post('/login', async (req: Request, res: Response) => {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });

//     if (!user || !(await user.comparePassword(password))) {
//         res.status(401).json({ message: 'Invalid credentials' });
//     }
//     else {
//         // (req.session as unknown as ISession) = {
//         //     userId: user._id as string,
//         //     username: user.username,
//         //     role: user.role
//         // }

//         res.json({ message: 'Logged in successfully', role: user.role });
//     }
// });
// router.post('/logout', (req: Request, res: Response) => {
//     req.session.destroy((err) => {
//         if (err) {
//             return res.status(500).json({ message: 'Could not log out' });
//         }
//         res.clearCookie('connect.sid');
//         res.json({ message: 'Logged out successfully' });
//     });
// });
// const isAuthenticated = (req: Request, res: Response, next: Function) => {
//     if ('userId' in req.session) {
//         return next();
//     } else {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
// };
// const isAdmin = (req: Request, res: Response, next: Function) => {
//     if ('role' in req.session) {
//         if (req.session.role === 'admin') {

//             return next();
//         } else {
//             return res.status(403).json({ message: 'Forbidden' });
//         }
//     } else {
//         return res.status(403).json({ message: 'Forbidden' });
//     }
// };
// router.get('/protected', isAuthenticated, (req: Request, res: Response) => {
//     res.json({ message: 'This is a protected route' });
// });
// router.get('/admin', isAuthenticated, isAdmin, (req: Request, res: Response) => {
//     res.json({ message: 'This is an admin route' });
// });
// export default router;

import express, { Request, Response, NextFunction, RequestHandler } from "express";
import bcrypt from "bcrypt";
import User from "./model/user"
    ;
const router = express.Router();

// Extend express-session for `userId`
declare module "express-session" {
    interface SessionData {
        userId: string;

    }
}
// Middleware for Authentication
const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        res.status(401).json({ error: "Unauthorized" });
    } else {
        next();
    }
};

router.post("/register", async (req: Request, res: Response) => {
    try {
        const { username, password, role } = req.body;
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const newUser = new User({ username, password: hashedPassword, role, activities: [] });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// Login Route
router.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        const user = (await User.findOne({ username })) as { _id: string; password: string } | null;
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(400).json({ error: "Invalid credentials" });
        } else {
            req.session.userId = user._id.toString();
            res.status(200).json({ message: "Login successful" });
        }
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

// Logout Route
router.post("/logout", authMiddleware, async (req: Request, res: Response) => {
    req.session.destroy((error) => {
        if (error) {

            res.status(500).json({ error: "Logout failed" });
        } else {
            res.status(200).json({ message: "Logout successful" });
        }
    });
});


// Protected Profile Route
router.get("/profile", authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
        } else {

            res.status(200).json({ username: user.username });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});


// Update Username
router.put("/update", authMiddleware, async (req: Request, res: Response): Promise<void> => {
    const { newUsername } = req.body;


    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
        } else {
            user.username = newUsername;
            user.activities.push(`Updated username to ${newUsername}`);
            await user.save();
            res.status(200).json({ message: "Username updated successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
});
router.put("/updatepass", authMiddleware, async (req: Request, res: Response): Promise<void> => {
    const { newUserpass } = req.body;

    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
        } else {
            user.password = newUserpass;
            user.activities.push(`Updated password to ${newUserpass}`);
            await user.save();
            res.status(200).json({ message: "password updated successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
});


//change the password
router.put("/changepass", authMiddleware, async (req: Request, res: Response): Promise<void> => {
    const { oldpass, newpass } = req.body;
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            res.status(404).json({ error: "user not found" });
        } else {
            if (user.password === oldpass) {
                user.password = newpass;
                user.activities.push(`Updated password to ${newpass}`);
                await user.save();
                res.status(200).json({ message: "password updated successfully" });
            }


        }
    } catch (error) {
        res.status(500).json({ error: "changes failed" });
    }
});
// Delete Account
router.delete("/delete", authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
        } else {
            await User.findByIdAndDelete(req.session.userId);
            res.status(200).json({ message: "Account deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: "Deletion failed" });
    }
});


// Get Activities
router.get("/activities", authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json({ activities: user.activities });
        }
    } catch (error) {
        res.status(500).json({ error: "Could not fetch activities" });
    }
});
const isAdmin = (req: Request, res: Response, next: Function) => {
    if ('role' in req.session) {
        if (req.session.role === 'admin') {
            return next();
        } else {
            return res.status(403).json({ message: 'Forbidden' });
        }
    } else {
        return res.status(403).json({ message: 'Forbidden' });
    }
};
router.get('/admin', authMiddleware, isAdmin, (req: Request, res: Response) => {
    res.json({ message: 'This is an admin route' });
});

export default router;


