import connectDB from "./db";
import Admin from "./models/Admin";
import BlogPost from "./models/BlogPost";
import Experience from "./models/Experience";
import Project from "./models/Project";
import Skill from "./models/Skill";
import { hashPassword } from "./password";

/**
 * Seed the database with initial data
 * Usage: node -r tsx/register lib/seed.ts
 */

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Admin.deleteMany({});
    await BlogPost.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});

    // Create admin user
    console.log("👤 Creating admin user...");
    const hashedPassword = await hashPassword("Admin@123");
    const admin = await Admin.create({
      email: "admin@portfolio.com",
      password: hashedPassword,
      name: "Amir Hamza",
      role: "super_admin",
      isActive: true,
    });
    console.log("✅ Admin created:", admin.email);

    // Create skills
    console.log("💡 Creating skills...");
    const skills = await Skill.insertMany([
      {
        name: "React",
        category: "frontend",
        proficiency: 95,
        description:
          "Advanced React with Hooks, Context, and Server Components",
        icon: "Atom",
        order: 1,
        isActive: true,
      },
      {
        name: "Next.js",
        category: "frontend",
        proficiency: 92,
        description: "Full-stack React framework with App Router expertise",
        icon: "Rocket",
        order: 2,
        isActive: true,
      },
      {
        name: "TypeScript",
        category: "tooling",
        proficiency: 96,
        description: "Type-safe development and advanced TypeScript patterns",
        icon: "Type",
        order: 3,
        isActive: true,
      },
      {
        name: "Node.js",
        category: "backend",
        proficiency: 90,
        description:
          "Backend development with Express, APIs, and microservices",
        icon: "Cpu",
        order: 4,
        isActive: true,
      },
      {
        name: "MongoDB",
        category: "database",
        proficiency: 85,
        description: "NoSQL database design, indexing, and aggregation",
        icon: "Database",
        order: 5,
        isActive: true,
      },
      {
        name: "AWS",
        category: "devops",
        proficiency: 82,
        description: "Cloud infrastructure, Lambda, S3, and deployment",
        icon: "Cloud",
        order: 6,
        isActive: true,
      },
    ]);
    console.log(`✅ Created ${skills.length} skills`);

    // Create experience
    console.log("💼 Creating experience entries...");
    const experiences = await Experience.insertMany([
      {
        company: "Tech Innovation Inc",
        companyUrl: "https://techinnovation.com",
        position: "Senior Full-Stack Developer",
        location: "San Francisco, CA (Remote)",
        startDate: new Date("2021-06-01"),
        current: true,
        description: "Leading development of enterprise web applications",
        responsibilities: [
          "Architected and developed scalable web applications using React and Node.js",
          "Led a team of 5 developers in agile development practices",
          "Implemented CI/CD pipelines reducing deployment time by 60%",
        ],
        achievements: [
          "Reduced page load time by 40% through optimization",
          "Increased test coverage from 45% to 90%",
        ],
        technologies: ["React", "Next.js", "Node.js", "MongoDB", "AWS"],
        order: 1,
        isActive: true,
      },
      {
        company: "StartupHub",
        companyUrl: "https://startuphub.com",
        position: "Full-Stack Developer",
        location: "New York, NY",
        startDate: new Date("2019-03-01"),
        endDate: new Date("2021-05-31"),
        current: false,
        description: "Built and maintained multiple client projects",
        responsibilities: [
          "Developed full-stack web applications for various clients",
          "Collaborated with designers to implement responsive UI/UX",
          "Maintained and optimized existing codebases",
        ],
        achievements: [
          "Successfully delivered 12+ client projects on time",
          "Implemented real-time features using WebSockets",
        ],
        technologies: ["React", "Express", "PostgreSQL", "Docker"],
        order: 2,
        isActive: true,
      },
    ]);
    console.log(`✅ Created ${experiences.length} experience entries`);

    // Create projects
    console.log("🚀 Creating projects...");
    const projects = await Project.insertMany([
      {
        title: "E-Commerce Platform",
        slug: "e-commerce-platform",
        summary: "A full-featured e-commerce platform with real-time inventory",
        description:
          "Built a comprehensive e-commerce solution with product management, shopping cart, secure payments, and admin dashboard.",
        details:
          "This project showcases a complete e-commerce ecosystem with modern features.",
        technologies: [
          "Next.js",
          "TypeScript",
          "MongoDB",
          "Stripe",
          "Tailwind CSS",
        ],
        category: "Web Application",
        image: "/placeholder-project.jpg",
        githubUrl: "https://github.com/yourusername/ecommerce",
        demoUrl: "https://ecommerce-demo.vercel.app",
        featured: true,
        published: true,
        order: 1,
      },
      {
        title: "Task Management Dashboard",
        slug: "task-management-dashboard",
        summary: "Collaborative task management with real-time updates",
        description:
          "A Trello-like task management application with drag-and-drop, real-time collaboration, and team features.",
        technologies: ["React", "Node.js", "Socket.io", "PostgreSQL", "Redux"],
        category: "Web Application",
        image: "/placeholder-project.jpg",
        githubUrl: "https://github.com/yourusername/taskmanager",
        demoUrl: "https://taskmanager-demo.vercel.app",
        featured: true,
        published: true,
        order: 2,
      },
    ]);
    console.log(`✅ Created ${projects.length} projects`);

    // Create blog posts
    console.log("📝 Creating blog posts...");
    const { default: docToHtml } = await import("./doc-to-html");
    const blogPosts = await BlogPost.insertMany([
      {
        title: "Getting Started with Next.js 14",
        slug: "getting-started-with-nextjs-14",
        excerpt:
          "Learn how to build modern web applications with Next.js 14 and the new App Router.",
        content: docToHtml({
          time: Date.now(),
          blocks: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Next.js 14 introduces significant improvements...",
                },
              ],
            },
          ],
          version: "2.28.0",
        } as any),
        tags: ["Next.js", "React", "Tutorial"],
        category: "Web Development",
        author: {
          name: "Amir Hamza",
        },
        published: true,
        featured: true,
        readingTime: "5 min read",
        publishedAt: new Date(),
      },
      {
        title: "Building RESTful APIs with Node.js",
        slug: "building-restful-apis-with-nodejs",
        excerpt:
          "A comprehensive guide to building scalable RESTful APIs using Node.js and Express.",
        content: docToHtml({
          time: Date.now(),
          blocks: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "RESTful APIs are the backbone of modern web applications...",
                },
              ],
            },
          ],
          version: "2.28.0",
        } as any),
        tags: ["Node.js", "API", "Backend"],
        category: "Backend Development",
        author: {
          name: "Amir Hamza",
        },
        published: true,
        featured: false,
        readingTime: "8 min read",
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
    ]);
    console.log(`✅ Created ${blogPosts.length} blog posts`);

    console.log("\n✨ Database seeded successfully!");
    console.log("\n📋 Admin Credentials:");
    console.log("Email: admin@portfolio.com");
    console.log("Password: Admin@123");
    console.log("\n⚠️  Please change the admin password after first login!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed();
}

export default seed;
