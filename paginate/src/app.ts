import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from "./model/user"
import { Teach } from './model/teacture';

const app = express();
app.use(express.json());

// const User = mongoose.model<IUser & mongoose.Document>('User', userSchema);
mongoose
    .connect(process.env.MONGODB_URI || "mongodb+srv://mhatre:rashmi@cluster0.vfkv4.mongodb.net/students")
    .then(() => console.log("connected to MongoDB"))
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    });
// function generateUsers(count: number): IUser[] {
//     const users: IUser[] = [];
//     for (let i = 1; i <= count; i++) {
//         users.push({
//             name: `User ${i}`,
//             email: `user${i}@example.com`,
//         });
//     }
//     return users;
// }
app.post('/users', async (req: Request, res: Response) => {
    try {
        const { users } = req.body;

        // const users = generateUsers(count);
        const result = await User.insertMany(users);
        res.status(200).json({ message: 'Users created successfully', data: result });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/teacture', async (req: Request, res: Response) => {
    try {
        const { teactures } = req.body;

        // const users = generateUsers(count);
        const result = await Teach.insertMany(teactures);
        res.status(200).json({ message: 'Users created successfully', data: result });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/users', async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const aggregatepipeline =
            [
                {
                    $match: {
                        name:
                        {
                            $regex: search
                        }
                    }
                }
            ]

        const options = {
            page: parseInt(page as string, 10),
            limit: parseInt(limit as string, 10),
        };
        const result = await (User as any).aggregate((aggregatepipeline), options);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
});
app.get('/class', async (req: Request, res: Response) => {
    try {
        const unique = await User.aggregate(
            [
                {
                    $group: {
                        _id: "$class"
                    }
                }
            ]
        )
        // const list = unique.map((item) => item._id)

        res.status(200).json(unique);

    } catch (error) {
        res.status(500).json({ error });
    }
});
app.get('/numberofstudent', async (req: Request, res: Response) => {
    try {
        const numofstudent = await User.aggregate(
            [
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 }
                    }
                }
            ]
        )
        // const list = unique.map((item) => item._id)

        res.status(200).json(numofstudent);

    } catch (error) {
        res.status(500).json({ error });
    }
});

app.get('/avgofstudent', async (req: Request, res: Response) => {
    try {
        const avgofstudent = await User.aggregate(
            [
                {
                    $group: {
                        _id: "$name",
                        averageGrade: { $avg: "$marks" }
                    }
                }
            ]
        )
        // const list = unique.map((item) => item._id)

        res.status(200).json(avgofstudent);

    } catch (error) {
        res.status(500).json({ error });
    }
});
app.get('/gradeofstudent', async (req: Request, res: Response) => {
    try {
        const gradeofstudent = await User.aggregate(
            [

                {
                    $project: {
                        grade:
                        {
                            $cond: {
                                if: { $gte: ["$marks", 90] },
                                then: "A",
                                else: "B",
                            }
                        },
                        name: 1,
                        email: 1,
                        marks: 1,
                        class: 1
                    }
                }
            ]
        )
        // const list = unique.map((item) => item._id)

        res.status(200).json(gradeofstudent);

    } catch (error) {
        res.status(500).json({ error });
    }
});
app.get('/avgofgrade', async (req: Request, res: Response) => {
    try {
        const avgofgrade = await User.aggregate(
            [{
                $project: {
                    grade:
                    {
                        $cond: {
                            if: { $gte: ["$marks", 90] },
                            then: "A",
                            else: "B",
                        }
                    },
                    name: 1,
                    email: 1,
                    marks: 1,
                    class: 1
                }
            },
            {
                $group: {
                    _id: "$grade",
                    avggrade: { $avg: "$marks" }
                }
            }
            ]
        )
        // const list = unique.map((item) => item._id)

        res.status(200).json(avgofgrade);

    } catch (error) {
        res.status(500).json({ error });
    }
});
app.get('/lookup', async (req: Request, res: Response) => {
    try {
        const lookup = await Teach.aggregate(
            [
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "class",
                        foreignField: "class",
                        as: "teach",
                    }
                },
                {
                    $project:
                    {
                        name: 1,
                        class: 1,
                        count: {
                            $size: "$teach"
                        }

                    }

                }
            ]
        )
        // const list = unique.map((item) => item._id)

        res.status(200).json(lookup);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
    }
});
app.get('/higestscore', async (req: Request, res: Response) => {
    try {
        const higestscore = await User.aggregate(
            [{
                $group: {
                    _id: "$class",

                    maxsocre: {
                        $max: "$marks"
                    },
                    student: {
                        $first: "$name"
                    }

                },
                // $project:
                // {
                //     maxsocre: {
                //         $max: "$marks"
                //     },
                //     name: 1,
                //     class: 1
                // }
            },
            {
                $lookup:
                {
                    from: "teaches",
                    localField: "_id",
                    foreignField: "class",
                    as: "teach",
                }
            },
            {
                $project: {
                    teacher: { $arrayElemAt: ["$teach.name", 0] },
                    student: 1,
                    maxsocre: 1,
                    class: "$_id"
                }
            }
            ]
        )
        // const list = unique.map((item) => item._id)
        res.status(200).json(higestscore);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
    }
});
app.get('/unwind', async (req: Request, res: Response) => {
    try {
        const higestscore = await User.aggregate(
            [{
                $group: {
                    _id: "$class",

                    maxsocre: {
                        $max: "$marks"
                    },
                    student: {
                        $first: "$name"
                    }

                },
                // $project:
                // {
                //     maxsocre: {
                //         $max: "$marks"
                //     },
                //     name: 1,
                //     class: 1
                // }
            },
            {
                $lookup:
                {
                    from: "teaches",
                    localField: "_id",
                    foreignField: "class",
                    as: "teach",
                }
            },
            // {
            //     $project: {
            //         teacher: { $arrayElemAt: ["$teach.name", 0] },
            //         student: 1,
            //         maxsocre: 1,
            //         class: "$_id"
            //     }
            // }
            {
                $unwind: { path: "$teach", preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    teacher: "$teach.name",
                    student: 1,
                    maxsocre: 1,
                    class: "$_id"
                }
            }

            ]
        )
        // const list = unique.map((item) => item._id)
        res.status(200).json(higestscore);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
    }
});
app.listen(5500, () => {
    console.log('Server running on http://localhost:5500');
});
