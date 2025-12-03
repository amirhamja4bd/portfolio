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
  experienceLevel: "beginner" | "intermediate" | "advanced" | "expert";
  proficiency: number;
  icon: string;
  logo?: string;
  experienceYear?: Date;
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
    experienceLevel: {
      type: String,
      required: [true, "Experience level is required"],
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "intermediate",
    },
    proficiency: {
      type: Number,
      required: [true, "Proficiency level is required"],
      min: [0, "Proficiency cannot be less than 0"],
      max: [100, "Proficiency cannot exceed 100"],
    },
    icon: {
      type: String,
      required: [true, "Icon name is required"],
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    experienceYear: {
      type: Date,
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

// Clear the model cache to avoid schema conflicts
if (mongoose.models.Skill) {
  delete mongoose.models.Skill;
}

const Skill: Model<ISkill> = mongoose.model<ISkill>("Skill", SkillSchema);

export default Skill;
