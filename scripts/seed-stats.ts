import "dotenv/config";
import connectDB from "../lib/db";
import Stats from "../lib/models/Stats";

const seedStatsData = {
  description:
    "A curated collection of projects showcasing innovative solutions, from full-stack applications to AI-powered platforms. Each project represents a unique challenge conquered with creativity and precision.",
  items: [
    { value: "50+", label: "Projects Completed", order: 1 },
    { value: "30+", label: "Happy Clients", order: 2 },
    { value: "5+", label: "Years Experience", order: 3 },
  ],
};

async function seedStats() {
  try {
    await connectDB();
    console.log("Connected to database");

    // Check if stats data already exists
    const existingStats = await Stats.findOne({});

    if (existingStats) {
      console.log("Stats data already exists. Updating...");
      existingStats.items = seedStatsData.items;
      existingStats.description = seedStatsData.description;
      await existingStats.save();
      console.log("Stats data updated successfully");
    } else {
      // Create new stats data
      const stats = await Stats.create(seedStatsData);
      console.log("Stats data seeded successfully:");
      console.log(stats);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding stats data:", error);
    process.exit(1);
  }
}

seedStats();
