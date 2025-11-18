import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISkill extends Document {
  name: string;
  category:
    | "frontend"
    | "backend"
    | "devops"
    | "database"
    | "tooling"
    | "leadership";
  proficiency: number;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "frontend",
        "backend",
        "devops",
        "database",
        "tooling",
        "leadership",
      ],
    },
    proficiency: {
      type: Number,
      required: [true, "Proficiency level is required"],
      min: [0, "Proficiency cannot be less than 0"],
      max: [100, "Proficiency cannot exceed 100"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },
    icon: {
      type: String,
      required: [true, "Icon name is required"],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
SkillSchema.index({ category: 1, order: 1 });
SkillSchema.index({ isActive: 1 });

const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);

export default Skill;
