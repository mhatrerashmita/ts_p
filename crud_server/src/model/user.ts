// import mongoose, { Document, Model, Schema } from 'mongoose';
// import bcrypt from 'bcrypt';

// export interface IUser extends Document {
//     username: string;
//     password: string;
//     role: string;
//     comparePassword: (password: string) => Promise<boolean>;
// }

// const userSchema = new Schema<IUser>({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ['user', 'admin'], default: 'user' } // Role for authorization
// });

// // Method to compare passwords
// userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
//     return await bcrypt.compare(password, this.password);
// };

// // Hash password before saving
// userSchema.pre<IUser>('save', async function () {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
// });

// const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

// export default User;

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    role: string;
    activities: string[];
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    activities: { type: [String], default: [] },
});

export default mongoose.model<IUser>("User", UserSchema);
