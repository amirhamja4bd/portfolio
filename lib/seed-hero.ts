import "dotenv/config";
import connectDB from "./db";
import Hero from "./models/Hero";

const seedHeroData = {
  badge: {
    text: "WELCOME TO MY WORLD",
  },
  techStack: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "GraphQL",
    "MongoDB",
    "AWS",
    "Framer Motion",
    "Editor.js",
  ],
  heading: {
    name: "I'm Amir Hamza",
    title: "Software Engineer (Frontend)",
  },
  bio: `Architecting scalable systems and leading platform initiatives that drive business impact.
  Specialized in distributed systems, cloud infrastructure, and engineering excellence.`,
  cta: {
    primary: {
      text: "View Projects",
      href: "#projects",
    },
    secondary: {
      text: "Get in Touch",
      href: "#contact",
    },
  },
  stats: [
    { label: "Years Experience", value: "6+" },
    { label: "Projects Delivered", value: "24+" },
    { label: "Engineers Mentored", value: "15+" },
  ],
  expertise: [
    "Platform Engineering",
    "Distributed Systems",
    "Cloud Architecture (AWS)",
    "DevOps & CI/CD",
    "Microservices",
    "Technical Leadership",
  ],
  socialLinks: [
    {
      icon: "Github",
      href: "https://github.com/amirhamja4bd",
      label: "GitHub",
    },
    {
      icon: "Linkedin",
      href: "https://linkedin.com/in/amirhamza",
      label: "LinkedIn",
    },
    {
      icon: "Mail",
      href: "https://mail.google.com/mail/?view=cm&to=contact@amirhamza.com",
      label: "Email",
    },
  ],
  published: true,
};

async function seedHero() {
  try {
    await connectDB();
    console.log("Connected to database");

    // Check if hero data already exists
    const existingHero = await Hero.findOne({});

    if (existingHero) {
      console.log("Hero data already exists. Skipping seed.");
      console.log("Existing hero:", existingHero);
      process.exit(0);
    }

    // Create new hero data
    const hero = await Hero.create(seedHeroData);
    console.log("Hero data seeded successfully:");
    console.log(hero);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding hero data:", error);
    process.exit(1);
  }
}

seedHero();
