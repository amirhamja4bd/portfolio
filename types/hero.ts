export interface SocialLink {
  icon: string;
  link: string;
  title: string;
}

export interface Badge {
  text: string;
}

export interface Heading {
  name: string;
  title: string;
}

export interface Cta {
  primary: {
    text: string;
    href: string;
  };
  secondary: {
    text: string;
    href: string;
  };
}

export interface HeroData {
  _id?: string;
  badge: Badge;
  techStack: string[];
  heading: Heading;
  bio: string;
  cta: Cta;
  socialLinks: SocialLink[];
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HeroApiResponse {
  success: boolean;
  data: HeroData;
  message?: string;
}

export interface HeroListApiResponse {
  success: boolean;
  count: number;
  data: HeroData[];
}

export interface HeroErrorResponse {
  error: string;
  details?: string;
}
