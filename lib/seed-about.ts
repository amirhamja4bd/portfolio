import "dotenv/config";
import connectDB from "./db";
import About from "./models/About";

const seedAboutData = {
  title: "About",
  description:
    "I lead teams shipping complex products while maintaining a craftsman mindset. From redesigning deployment platforms to mentoring engineers through promotions, I specialize in the intersection of developer experience, platform reliability, and product delivery.",
  infoCards: [
    {
      title: "Mission",
      description:
        "Help engineering orgs operate like high-performing product teams, pairing delightful DX with measurable business outcomes.",
    },
    {
      title: "Superpower",
      description:
        "Translating ambiguous ideas into roadmaps, then delivering them with systems thinking and dogfooding-driven feedback loops.",
    },
  ],
  snapshot: {
    title: "Professional Snapshot",
    items: [
      {
        label: "Location",
        value: "Berlin, Germany",
      },
      {
        label: "Experience",
        value: "10+ years · Staff level",
      },
      {
        label: "Availability",
        value:
          "Open to principal-level roles & technical leadership engagements",
      },
      {
        label: "Focus Areas",
        value: "DevOps, Platform Engineering, Team Leadership",
      },
    ],
  },
  education: {
    title: "Education",
    items: [
      {
        school: "University of Copenhagen",
        degree: "MSc Computer Science",
        year: "2013",
      },
      {
        school: "Certified Kubernetes Administrator",
        degree: "CNCF",
        year: "2020",
      },
    ],
  },
  certifications: {
    title: "Professional Certifications",
    items: [
      {
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        year: "2021",
      },
      {
        name: "Certified Kubernetes Administrator (CKA)",
        issuer: "CNCF",
        year: "2020",
      },
    ],
  },
  interests: {
    title: "Beyond the Keyboard",
    description:
      "When I'm not shaping developer experiences, you'll find me exploring trails, composing ambient electronic music, or tinkering with custom keyboards. Curiosity fuels everything I do.",
    items: [
      {
        icon: "🏃‍♂️",
        title: "Outdoors",
        description: "Trail running & hiking",
      },
      {
        icon: "🎵",
        title: "Music",
        description: "Ambient electronic",
      },
      {
        icon: "⌨️",
        title: "Hardware",
        description: "Custom keyboards",
      },
      {
        icon: "📚",
        title: "Learning",
        description: "Always exploring",
      },
    ],
  },
  published: true,
};

async function seedAbout() {
  try {
    await connectDB();
    console.log("Connected to database");

    // Check if about data already exists
    const existingAbout = await About.findOne({});

    if (existingAbout) {
      console.log("About data already exists. Skipping seed.");
      console.log("Existing about:", existingAbout);
      process.exit(0);
    }

    // Create new about data
    const about = await About.create(seedAboutData);
    console.log("About data seeded successfully:");
    console.log(about);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding about data:", error);
    process.exit(1);
  }
}

seedAbout();
