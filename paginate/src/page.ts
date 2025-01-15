// import express, { Request, Response } from 'express';
// import mongoose from 'mongoose';
// import mongoosePaginate from 'mongoose-paginate-v2';

// const app = express();
// app.use(express.json());

// // User schema and model
// interface IUser {
//     name: string;
//     email: string;
//     age: number;
// }

// const userSchema = new mongoose.Schema<IUser>({
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     age: { type: Number, required: true },
// });

// userSchema.plugin(mongoosePaginate);
// const User = mongoose.model<IUser & mongoose.Document>('User', userSchema);

// // Connect to MongoDB
// mongoose
//     .connect(process.env.MONGODB_URI || "mongodb+srv://mhatre:rashmi@cluster0.vfkv4.mongodb.net/roletable")
//     .then(() => console.log("connected to MongoDB"))
//     .catch((err) => {
//         console.error("MongoDB connection failed:", err.message);
//         process.exit(1);
//     });

// // API to get paginated users
// app.get('/users', async (req: Request, res: Response) => {
//     try {
//         const { page = 1, limit = 10 } = req.query;
//         const options = {
//             page: parseInt(page as string, 10),
//             limit: parseInt(limit as string, 10),
//             sort: { age: 1 },
//         };

//         const result = await User.paginate({}, options);
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ error: error });
//     }
// });

// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

