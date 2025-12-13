export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  category: string;
  thumbnail: string;
  images: string[];
  videos: string[];
  githubUrls: { label: string; url: string }[];
  demoUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
  metrics?: { label: string; value: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  category: string;
  thumbnail: string;
  images: string[];
  videos: string[];
  githubUrls: { label: string; url: string }[];
  demoUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
  metrics?: { label: string; value: string }[];
  createdAt: string;
  updatedAt: string;
}

// Note: Static data removed - now using API data from /api/projects
