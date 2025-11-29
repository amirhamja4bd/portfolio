import { siteConfig } from "@/config/site";

export type SkillCategory =
  | "frontend"
  | "backend"
  | "devops"
  | "database"
  | "tooling"
  | "leadership";

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number;
  description: string;
  icon: string;
}

export const skills: SkillItem[] = [
  {
    id: "react",
    name: "React",
    category: "frontend",
    proficiency: 95,
    description: "Hooks, Suspense, Server Components, performance profiling",
    icon: "Atom",
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "frontend",
    proficiency: 92,
    description:
      "App Router, Edge runtime, incremental adoption, Vercel platform",
    icon: "Rocket",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "tooling",
    proficiency: 96,
    description: "Type-safe design systems, API contracts, monorepos",
    icon: "Type",
  },
  {
    id: "node",
    name: "Node.js",
    category: "backend",
    proficiency: 90,
    description: "REST/GraphQL APIs, messaging, background jobs",
    icon: "Cpu",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "database",
    proficiency: 85,
    description: "Schema design, indexing, aggregation pipelines",
    icon: "Database",
  },
  {
    id: "aws",
    name: "AWS",
    category: "devops",
    proficiency: 82,
    description: "Serverless, container orchestration, observability pipelines",
    icon: "Cloud",
  },
  {
    id: "leadership",
    name: "Engineering Leadership",
    category: "leadership",
    proficiency: 88,
    description: "Team building, roadmap shaping, incident response",
    icon: "Sparkles",
  },
];

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  details?: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  image: string;
  category: string;
  featured?: boolean;
}

export const projects: ProjectItem[] = [
  {
    id: "dx-foundation",
    title: "DX Foundations Platform",
    slug: "dx-foundations-platform",
    summary:
      "Unified developer portal with golden paths and integrated observability.",
    description:
      "Led a cross-functional initiative to centralize deployment workflows, reducing lead time by 42%. Built with Next.js, GraphQL, and a microservices mesh.",
    technologies: ["Next.js", "GraphQL", "Kubernetes", "Temporal"],
    githubUrl: "https://github.com/amir/dx-foundations",
    demoUrl: "https://demo.example.com",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80",
    category: "Platform",
    featured: true,
  },
  {
    id: "ai-tutor",
    title: "AI Tutor for Engineers",
    slug: "ai-tutor",
    summary:
      "Conversational learning platform personalized for engineering teams.",
    description:
      "Built an LLM-powered education platform enabling engineering onboarding in under a week. Implemented adaptive curriculum, analytics, and secure knowledge ingestion.",
    technologies: ["Next.js", "LangChain", "Pinecone", "Supabase"],
    githubUrl: "https://github.com/amir/ai-tutor",
    demoUrl: "https://tutor.example.com",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    category: "AI",
  },
  {
    id: "finops-dashboard",
    title: "FinOps Insights Dashboard",
    slug: "finops-dashboard",
    summary:
      "Real-time cloud cost governance with anomaly detection and team workflows.",
    description:
      "Implemented event-driven architecture ingesting 5M metrics/day with auto-tagging and anomaly detection. Cut monthly cloud spend by 23% across the organization.",
    technologies: ["Next.js", "AWS", "Kafka", "Snowflake"],
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    githubUrl: "https://github.com/amir/finops-dashboard",
    category: "Data",
  },
];

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  location: string;
  description: string[];
  technologies: string[];
  logo: string;
}

export const experience: ExperienceItem[] = [
  {
    id: "atlas",
    company: "Atlas Systems",
    role: "Staff Software Engineer · Platform",
    startDate: "2021",
    endDate: "Present",
    location: "Remote · EU",
    description: [
      "Led developer platform initiatives and unified CI/CD across 120+ services.",
      "Designed DX programs improving build times by 3x and reducing onboarding from 45 → 12 days.",
      "Partnered with security to roll out zero-trust architecture without developer friction.",
    ],
    technologies: ["Next.js", "Kubernetes", "Go", "Terraform", "Temporal"],
    logo: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: "lumina",
    company: "Lumina Labs",
    role: "Senior Software Engineer",
    startDate: "2018",
    endDate: "2021",
    location: "Berlin, Germany",
    description: [
      "Scaled B2B analytics suite to 15M+ monthly events while maintaining sub-second queries.",
      "Shepherded migration from legacy monolith to service-oriented architecture.",
      "Mentored junior engineers, instituted engineering ladder, and ran incident reviews.",
    ],
    technologies: ["TypeScript", "Node.js", "PostgreSQL", "AWS", "Snowflake"],
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=80&q=80",
  },
];

export interface BlogPostPreview {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  category?: string; // Optional for backward compatibility
  publishedAt: string;
  thumbnail?: string;
  // Legacy fields for static demo data
  excerpt?: string;
  readingTime?: string;
  coverImage?: string;
}

export interface BlogPost extends BlogPostPreview {
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  images?: string[];
  views?: number;
  reactionsCount?: {
    1?: number;
    2?: number;
    3?: number;
    4?: number;
    5?: number;
  };
  // Optional comments included when fetching with ?comments=true from the API
  comments?: {
    _id: string;
    postId?: string;
    parentId?: string | null;
    name: string;
    email: string;
    avatar?: string;
    content: string;
    ip?: string;
    userAgent?: string;
    isDeleted?: boolean;
    status?: "pending" | "approved" | "rejected";
    createdAt?: string;
    updatedAt?: string;
  }[];
}

export interface ContactChannel {
  icon: string;
  label: string;
  value: string;
  href: string;
}

export const contactChannels: ContactChannel[] = [
  {
    icon: "Mail",
    label: "Email",
    value: "hello@example.com",
    href: siteConfig.mail,
  },
  {
    icon: "Linkedin",
    label: "LinkedIn",
    value: "@amir",
    href: siteConfig.linkedin,
  },
  {
    icon: "Calendar",
    label: "Calendly",
    value: "Book a 30-min chat",
    href: "https://calendly.com/amir/intro",
  },
];
