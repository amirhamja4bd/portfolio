import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISocialAccount {
  name: string;
  icon?: string;
  url: string;
  order: number;
}

export interface IResume {
  name: string;
  resumeUrl: string;
  isPrimary: boolean;
  uploadedAt: Date;
}

export interface ISettings extends Document {
  socialAccounts: ISocialAccount[];
  resumes: IResume[];
  createdAt: Date;
  updatedAt: Date;
}

const SocialAccountSchema = new Schema<ISocialAccount>({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
});

const ResumeSchema = new Schema<IResume>({
  name: {
    type: String,
    required: true,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const SettingsSchema = new Schema<ISettings>(
  {
    socialAccounts: [SocialAccountSchema],
    resumes: [ResumeSchema],
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
SettingsSchema.index({}, { unique: true });

const Settings: Model<ISettings> =
  mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
