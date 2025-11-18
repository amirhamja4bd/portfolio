import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  summary: string;
  description: string;
  details?: string;
  technologies: string[];
  category: string;
  image: string;
  images?: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  published: boolean;
  order: number;
  metrics?: {
    label: string;
    value: string;
  }[];
  challenges?: string;
  solutions?: string;
  results?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9-]+$/,
        "Slug must contain only lowercase letters, numbers, and hyphens",
      ],
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      trim: true,
      maxlength: [300, "Summary cannot exceed 300 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    details: {
      type: String,
      trim: true,
    },
    technologies: {
      type: [String],
      required: [true, "At least one technology is required"],
      validate: {
        validator: function (techs: string[]) {
          return techs.length > 0 && techs.length <= 20;
        },
        message: "Technologies must have between 1 and 20 items",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: [
        "Web Application",
        "Mobile App",
        "API",
        "Tool",
        "Library",
        "Platform",
        "Other",
      ],
    },
    image: {
      type: String,
      required: [true, "Project image is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\//, "Please provide a valid URL"],
    },
    demoUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\//, "Please provide a valid URL"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    metrics: [
      {
        label: String,
        value: String,
      },
    ],
    challenges: String,
    solutions: String,
    results: String,
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ published: 1, order: 1 });
ProjectSchema.index({ featured: 1 });
ProjectSchema.index({ category: 1 });

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
