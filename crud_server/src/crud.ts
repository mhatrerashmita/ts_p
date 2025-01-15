// import fs from 'fs';
// import path from 'path';
// import { User } from './model/model';

// const filePath = path.join(__dirname, 'users.json');

// const getUsers = (): User[] => {
//     const data = fs.readFileSync(filePath, 'utf-8');
//     return JSON.parse(data);
// };

// const getUserById = (id: number): User | undefined => {
//     const users = getUsers();
//     return users.find(user => user.id === id);
// };

// const createUser = (newUser: User): User => {
//     const users = getUsers();
//     newUser.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
//     users.push(newUser);
//     fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
//     return newUser;
// };

// const updateUser = (id: number, updatedUserData: Partial<User>): User | null => {
//     const users = getUsers();
//     const userIndex = users.findIndex(user => user.id === id);
//     if (userIndex === -1) return null;

//     const updatedUser = { ...users[userIndex], ...updatedUserData };
//     users[userIndex] = updatedUser;
//     fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
//     return updatedUser;
// };

// const deleteUser = (id: number): boolean => {
//     const users = getUsers();
//     const userIndex = users.findIndex(user => user.id === id);
//     if (userIndex === -1) return false;

//     users.splice(userIndex, 1);
//     fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
//     return true;
// };

// export { getUsers, getUserById, createUser, updateUser, deleteUser };
import { Request, Response } from 'express';
import { UserModel, IUser } from './model/model';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const user = await UserModel.findOne({ id });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    try {
        const userCount = await UserModel.countDocuments();
        const newUser: IUser = new UserModel({ id: userCount + 1, name, email });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const updatedUserData = req.body;
    try {
        const updatedUser = await UserModel.findOneAndUpdate({ id }, updatedUserData, { new: true });
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const result = await UserModel.deleteOne({ id });
        if (result.deletedCount > 0) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};