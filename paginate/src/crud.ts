import { Request, Response } from 'express';
import { UserModel, IUser } from './model/user';


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
