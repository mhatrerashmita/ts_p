// import { Schema, model } from 'mongoose';
// import Joi from 'joi';

// // Validation schema
// export const MovieSchemaValidate = Joi.object({
//     id: Joi.number().required(),
//     name: Joi.string().required(),
//     email: Joi.string().email().required()
// });

// // Creating an interface for User
// export interface IUser {
//     id: number;
//     name: string;
//     email: string;
// }

// // User schema
// const userSchema = new Schema<IUser>({
//     id: {
//         type: Number,
//         required: true,
//         unique: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     }
// });

// // Creating a model
// export const UserModel = model<IUser>('User', userSchema); 

// import mongoose, { Schema, Document } from 'mongoose';
// // Define an interface for the User
// export interface IUser extends Document {
//     id: number;
//     name: string;
//     email: string;
// }

// // Create a schema for the User
// const userSchema = new Schema<IUser>({
//     id: {
//         type: Number,
//         required: true,
//         unique: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
// });

// // Create a model from the schema
// export const UserModel = mongoose.model<IUser>('User', userSchema);

import mongoose, { Schema, Document } from 'mongoose';
// Define an interface for the User
export interface IUser extends Document {
    id: number;
    password: string;
    email: string;
}
// Create a schema for the User
const userSchema = new Schema<IUser>({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
});

// Create a model from the schema
export const UserModel = mongoose.model<IUser>('User', userSchema);