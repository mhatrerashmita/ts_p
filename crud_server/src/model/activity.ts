import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
    userId: mongoose.Types.ObjectId;
    action: string;
    timestamp: Date;
}

const ActivityLogSchema: Schema<IActivityLog> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;