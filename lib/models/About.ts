import mongoose, { Document, Model, Schema } from "mongoose";

export interface IInfoCard {
  title: string;
  description: string;
}

export interface ISnapshotItem {
  label: string;
  value: string;
}

export interface IEducationItem {
  school: string;
  degree: string;
  year: string;
}

export interface ICertificationItem {
  name: string;
  issuer: string;
  year: string;
}

export interface IInterestItem {
  icon: string;
  title: string;
  description: string;
}

export interface IAbout extends Document {
  title: string;
  description: string;
  infoCards: IInfoCard[];
  snapshot: {
    title: string;
    items: ISnapshotItem[];
  };
  education: {
    title: string;
    items: IEducationItem[];
  };
  certifications: {
    title: string;
    items: ICertificationItem[];
  };
  interests: {
    title: string;
    description: string;
    items: IInterestItem[];
  };
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    infoCards: [
      {
        title: {
          type: String,
          required: [true, "Info card title is required"],
          trim: true,
        },
        description: {
          type: String,
          required: [true, "Info card description is required"],
          trim: true,
        },
      },
    ],
    snapshot: {
      title: {
        type: String,
        required: [true, "Snapshot title is required"],
        trim: true,
      },
      items: [
        {
          label: {
            type: String,
            required: [true, "Snapshot item label is required"],
            trim: true,
          },
          value: {
            type: String,
            required: [true, "Snapshot item value is required"],
            trim: true,
          },
        },
      ],
    },
    education: {
      title: {
        type: String,
        required: [true, "Education title is required"],
        trim: true,
      },
      items: [
        {
          school: {
            type: String,
            required: [true, "School name is required"],
            trim: true,
          },
          degree: {
            type: String,
            required: [true, "Degree is required"],
            trim: true,
          },
          year: {
            type: String,
            required: [true, "Year is required"],
            trim: true,
          },
        },
      ],
    },
    certifications: {
      title: {
        type: String,
        required: [true, "Certifications title is required"],
        trim: true,
      },
      items: [
        {
          name: {
            type: String,
            required: [true, "Certification name is required"],
            trim: true,
          },
          issuer: {
            type: String,
            required: [true, "Issuer is required"],
            trim: true,
          },
          year: {
            type: String,
            required: [true, "Year is required"],
            trim: true,
          },
        },
      ],
    },
    interests: {
      title: {
        type: String,
        required: [true, "Interests title is required"],
        trim: true,
      },
      description: {
        type: String,
        required: [true, "Interests description is required"],
        trim: true,
      },
      items: [
        {
          icon: {
            type: String,
            required: [true, "Interest icon is required"],
            trim: true,
          },
          title: {
            type: String,
            required: [true, "Interest title is required"],
            trim: true,
          },
          description: {
            type: String,
            required: [true, "Interest description is required"],
            trim: true,
          },
        },
      ],
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
AboutSchema.index({ published: 1, createdAt: -1 });

const About: Model<IAbout> =
  mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);

export default About;
