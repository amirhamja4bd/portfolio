import mongoose, { Document, Model, Schema } from "mongoose";

// Reaction types are numeric enums 1..5
export type ReactionType = 1 | 2 | 3 | 4 | 5;

export interface IPostReaction extends Document {
  postId: mongoose.Types.ObjectId;
  ip?: string;
  visitorId: string;
  reaction: ReactionType;
  createdAt: Date;
  updatedAt: Date;
}

const PostReactionSchema = new Schema<IPostReaction>(
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
    reaction: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: [true, "Reaction is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Allow one reaction per visitorId per post - update reaction if duplicate
PostReactionSchema.index({ postId: 1, visitorId: 1 }, { unique: true });
PostReactionSchema.index({ postId: 1, reaction: 1 });
// Legacy IP index to support existing records
PostReactionSchema.index({ postId: 1, ip: 1 });

const PostReaction: Model<IPostReaction> =
  mongoose.models.PostReaction ||
  mongoose.model<IPostReaction>("PostReaction", PostReactionSchema);

export default PostReaction;
