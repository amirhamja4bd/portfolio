import mongoose, { Document, Model, Schema } from "mongoose";

export type CommentStatus = "pending" | "approved" | "rejected";

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId | null;
  name: string;
  email: string;
  avatar?: string;
  content: string;
  ip?: string;
  visitorId: string;
  userAgent?: string;
  isDeleted: boolean;
  status: CommentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "BlogPost",
      required: [true, "postId is required"],
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      match: [/.+@.+\..+/, "Please provide a valid email address"],
    },
    avatar: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [5000, "Content cannot exceed 5000 characters"],
    },
    ip: {
      type: String,
      trim: true,
    },
    visitorId: {
      type: String,
      required: [true, "visitorId is required"],
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
CommentSchema.index({ postId: 1, status: 1, createdAt: -1 });
CommentSchema.index({ parentId: 1 });

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
