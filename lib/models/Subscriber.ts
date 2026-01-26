import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  ip?: string;
  userAgent?: string;
  deviceHash?: string;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ip: {
      type: String,
      select: false, // Hide from default queries for privacy
    },
    userAgent: {
      type: String,
      select: false,
    },
    deviceHash: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);

export default Subscriber;
