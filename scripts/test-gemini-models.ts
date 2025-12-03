// Quick test to check available Gemini models
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function testModels() {
  const modelsToTest = [
    "gemini-pro",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "models/gemini-pro",
    "models/gemini-1.5-flash",
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`\nTesting: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say 'OK' if you work");
      const response = await result.response;
      console.log(`✅ ${modelName} works!`, response.text());
    } catch (error: any) {
      console.log(`❌ ${modelName} failed:`, error.message.substring(0, 100));
    }
  }
}

testModels();
