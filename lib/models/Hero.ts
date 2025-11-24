import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISocialLink {
  icon: string;
  link: string;
  title: string;
}

export interface IBadge {
  text: string;
}

export interface IHeading {
  name: string;
  title: string;
}

export interface ICta {
  primary: {
    text: string;
    href: string;
  };
  secondary: {
    text: string;
    href: string;
  };
}

export interface IHero extends Document {
  badge: IBadge;
  techStack: string[];
  heading: IHeading;
  bio: string;
  cta: ICta;
  socialLinks: ISocialLink[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSchema = new Schema<IHero>(
  {
    badge: {
      text: {
        type: String,
        required: [true, "Badge text is required"],
        trim: true,
        maxlength: [100, "Badge text cannot exceed 100 characters"],
      },
    },
    techStack: {
      type: [String],
      required: [true, "Tech stack is required"],
      validate: {
        validator: function (stack: string[]) {
          return stack.length > 0 && stack.length <= 30;
        },
        message: "Tech stack must have between 1 and 30 items",
      },
    },
    heading: {
      name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [100, "Name cannot exceed 100 characters"],
      },
      title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"],
      },
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      trim: true,
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
    },
    cta: {
      primary: {
        text: {
          type: String,
          required: [true, "Primary CTA text is required"],
          trim: true,
        },
        href: {
          type: String,
          required: [true, "Primary CTA href is required"],
          trim: true,
        },
      },
      secondary: {
        text: {
          type: String,
          required: [true, "Secondary CTA text is required"],
          trim: true,
        },
        href: {
          type: String,
          required: [true, "Secondary CTA href is required"],
          trim: true,
        },
      },
    },
    socialLinks: [
      {
        icon: {
          type: String,
          required: true,
          trim: true,
        },
        link: {
          type: String,
          required: true,
          trim: true,
        },
        title: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
HeroSchema.index({ published: 1 });

const Hero: Model<IHero> =
  mongoose.models.Hero || mongoose.model<IHero>("Hero", HeroSchema);

export default Hero;
