import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with free API key
// Note: The SDK will automatically use the correct API version
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface PortfolioContext {
  hero?: {
    name: string;
    title: string;
    description: string;
    tagline?: string;
  };
  about?: {
    title: string;
    content: string;
  };
  skills?: Array<{
    name: string;
    category: string;
    level: string;
  }>;
  experience?: Array<{
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate?: string;
    current: boolean;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
  }>;
  blogs?: Array<{
    title: string;
    excerpt: string;
    slug: string;
    tags: string[];
  }>;
}

/**
 * Build system prompt with portfolio context
 */
function buildSystemPrompt(context: PortfolioContext): string {
  let prompt = `You are an intelligent AI assistant for ${
    context.hero?.name || "this developer"
  }'s portfolio website. `;
  prompt += `You have access to comprehensive information about their professional profile, skills, experience, projects, and blog posts. `;
  prompt += `Your role is to provide helpful, accurate, and engaging responses about ${
    context.hero?.name?.split(" ")[0] || "them"
  }.\n\n`;

  prompt += `**RESPONSE STYLE GUIDELINES:**\n`;
  prompt += `- Be conversational, friendly, and professional\n`;
  prompt += `- Use markdown formatting for better readability (bold, italic, lists, code blocks)\n`;
  prompt += `- Keep responses concise but informative\n`;
  prompt += `- Use emojis sparingly for emphasis\n`;
  prompt += `- If asked about specific projects or skills, provide detailed information\n`;
  prompt += `- If information is not available, politely say so and suggest related topics\n\n`;

  // Add Hero Information
  if (context.hero) {
    prompt += `**HERO INFORMATION:**\n`;
    prompt += `- Name: ${context.hero.name}\n`;
    prompt += `- Title: ${context.hero.title}\n`;
    prompt += `- Description: ${context.hero.description}\n`;
    if (context.hero.tagline) prompt += `- Tagline: ${context.hero.tagline}\n`;
    prompt += `\n`;
  }

  // Add About Information
  if (context.about) {
    prompt += `**ABOUT:**\n${context.about.content}\n\n`;
  }

  // Add Skills
  if (context.skills && context.skills.length > 0) {
    prompt += `**SKILLS:**\n`;
    const skillsByCategory = context.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(`${skill.name} (${skill.level})`);
      return acc;
    }, {} as Record<string, string[]>);

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      prompt += `- ${category}: ${skills.join(", ")}\n`;
    });
    prompt += `\n`;
  }

  // Add Experience
  if (context.experience && context.experience.length > 0) {
    prompt += `**WORK EXPERIENCE:**\n`;
    context.experience.forEach((exp, idx) => {
      prompt += `${idx + 1}. ${exp.position} at ${exp.company}\n`;
      prompt += `   Period: ${exp.startDate} - ${
        exp.current ? "Present" : exp.endDate || "N/A"
      }\n`;
      prompt += `   Description: ${exp.description}\n`;
    });
    prompt += `\n`;
  }

  // Add Projects
  if (context.projects && context.projects.length > 0) {
    prompt += `**PROJECTS:**\n`;
    context.projects.forEach((project, idx) => {
      prompt += `${idx + 1}. ${project.title}\n`;
      prompt += `   Description: ${project.description}\n`;
      prompt += `   Technologies: ${project.technologies.join(", ")}\n`;
      if (project.liveUrl) prompt += `   Live URL: ${project.liveUrl}\n`;
      if (project.githubUrl) prompt += `   GitHub: ${project.githubUrl}\n`;
    });
    prompt += `\n`;
  }

  // Add Blog Posts
  if (context.blogs && context.blogs.length > 0) {
    prompt += `**RECENT BLOG POSTS:**\n`;
    context.blogs.slice(0, 5).forEach((blog, idx) => {
      prompt += `${idx + 1}. ${blog.title}\n`;
      prompt += `   Excerpt: ${blog.excerpt}\n`;
      prompt += `   Tags: ${blog.tags.join(", ")}\n`;
    });
    prompt += `\n`;
  }

  prompt += `Now, based on this context, answer the user's question naturally and helpfully.`;

  return prompt;
}

/**
 * Generate AI response using Gemini with portfolio context
 */
export async function generateGeminiResponse(
  userMessage: string,
  portfolioContext: PortfolioContext,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return "⚠️ AI service is not configured. Please add your GEMINI_API_KEY to the environment variables. You can get a free API key from https://makersuite.google.com/app/apikey";
    }

    // Use Gemini Flash 2.5 (latest free tier model)
    // Available models (as of Dec 2024):
    // - "gemini-2.5-flash" (latest, fastest, recommended)
    // - "gemini-flash-latest" (stable alias)
    // - "gemini-2.0-flash" (also good)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // ✅ Latest Flash model - fast and FREE!
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048, // Increased for detailed responses
      },
    });

    // Build context-aware prompt
    const systemPrompt = buildSystemPrompt(portfolioContext);

    // Build conversation history (last 5 messages)
    const historyText = conversationHistory
      .slice(-5)
      .map(
        (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    // Combine everything into final prompt
    const fullPrompt = `${systemPrompt}

${
  historyText ? `**PREVIOUS CONVERSATION:**\n${historyText}\n\n` : ""
}**CURRENT USER QUESTION:**
${userMessage}

**YOUR RESPONSE:**`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return (
      text ||
      "I apologize, but I couldn't generate a response. Please try again."
    );
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      status: error.status,
      statusText: error.statusText,
    });

    // Handle specific errors
    if (error.message?.includes("API_KEY_INVALID") || error.status === 400) {
      return "⚠️ Invalid API key. Please check your GEMINI_API_KEY in environment variables.";
    }
    if (error.message?.includes("RATE_LIMIT") || error.status === 429) {
      return "⏱️ Rate limit exceeded. Please wait a moment and try again.";
    }
    if (error.message?.includes("SAFETY")) {
      return "🛡️ Response blocked by safety filters. Please rephrase your question.";
    }
    if (error.status === 403) {
      return "⚠️ API key doesn't have permission. Please check your Gemini API key settings.";
    }

    return "I encountered an error processing your request. Please try again or rephrase your question.";
  }
}

/**
 * Check if Gemini API is configured
 */
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}
