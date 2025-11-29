import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPostView extends Document {
  postId: mongoose.Types.ObjectId;
  ip?: string;
  visitorId: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostViewSchema = new Schema<IPostView>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "BlogPost",
      required: [true, "postId is required"],
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
  },
  {
    timestamps: true,
  }
);

// Indexing for efficient lookups. We keep visitorId as primary dedup key
// and continue to allow legacy lookups by IP for older documents.
PostViewSchema.index({ postId: 1, visitorId: 1 }, { unique: true });
PostViewSchema.index({ postId: 1, ip: 1 });

const PostView: Model<IPostView> =
  mongoose.models.PostView ||
  mongoose.model<IPostView>("PostView", PostViewSchema);

export default PostView;
