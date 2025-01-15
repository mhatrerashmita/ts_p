import mongoose, { Schema, Document } from "mongoose";
// import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseaggregatePaginate from 'mongoose-aggregate-paginate-v2'
export interface ITeach {
    name: string;
    class: string;
}
const userSchema: Schema = new Schema<ITeach>({
    name: { type: String, required: true },
    class: { type: String, required: true }
});
userSchema.plugin(mongooseaggregatePaginate);
export const Teach = mongoose.model<ITeach>("Teach", userSchema);