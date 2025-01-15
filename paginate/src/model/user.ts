import mongoose, { Schema, Document } from "mongoose";
// import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseaggregatePaginate from 'mongoose-aggregate-paginate-v2'
export interface IUser {
    name: string;
    email: string;
    marks: number;
    subject: string;
    class: string;
}
const userSchema: Schema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    marks: { type: Number, required: true },
    subject: { type: String, required: true },
    class: { type: String, required: true }
});
userSchema.plugin(mongooseaggregatePaginate);
export const User = mongoose.model<IUser>("User", userSchema);
