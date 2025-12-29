import mongoose, { Document, Model, Schema } from "mongoose";

export interface IStatItem {
  label: string;
  value: string;
  order: number;
}

export interface IStats extends Document {
  description?: string;
  items: IStatItem[];
  createdAt: Date;
  updatedAt: Date;
}

const StatItemSchema = new Schema<IStatItem>({
  label: {
    type: String,
    required: [true, "Label is required"],
    trim: true,
  },
  value: {
    type: String,
    required: [true, "Value is required"],
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const StatsSchema = new Schema<IStats>(
  {
    description: {
      type: String,
      trim: true,
    },
    items: [StatItemSchema],
  },
  {
    timestamps: true,
  }
);

// Ensure only one stats document exists
StatsSchema.index({}, { unique: true });

const Stats: Model<IStats> =
  mongoose.models.Stats || mongoose.model<IStats>("Stats", StatsSchema);

export default Stats;
