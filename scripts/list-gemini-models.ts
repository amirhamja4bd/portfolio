// List available Gemini models
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";

async function listModels() {
  try {
    console.log("Testing API Key:", API_KEY.substring(0, 10) + "...");
    console.log("\nFetching available models...\n");

    const genAI = new GoogleGenerativeAI(API_KEY);

    // Try to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );

    if (!response.ok) {
      console.error("❌ Error:", response.status, response.statusText);
      const text = await response.text();
      console.error("Response:", text);
      return;
    }

    const data = await response.json();
    console.log("✅ Available models:");
    data.models?.forEach((model: any) => {
      console.log(`  - ${model.name}`);
      console.log(
        `    Supports: ${model.supportedGenerationMethods?.join(", ")}`
      );
    });
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

listModels();
