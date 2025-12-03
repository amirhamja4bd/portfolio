import connectDB from "@/lib/db";
import { generateGeminiResponse, PortfolioContext } from "@/lib/gemini";
import {
  About,
  BlogPost,
  Experience,
  Hero,
  Project,
  Skill,
} from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * Fetch comprehensive portfolio data from MongoDB
 */
async function fetchPortfolioContext(): Promise<PortfolioContext> {
  try {
    await connectDB();

    // Fetch all data in parallel for better performance
    const [hero, about, skills, experience, projects, blogs] =
      await Promise.all([
        Hero.findOne().lean(),
        About.findOne().lean(),
        Skill.find().lean(),
        Experience.find().sort({ startDate: -1 }).lean(),
        Project.find({ published: true })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean(),
        BlogPost.find({ published: true })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

    // Transform data into context format
    const context: PortfolioContext = {};

    if (hero) {
      context.hero = {
        name: (hero as any).heading?.name || "Amir Hamza",
        title: (hero as any).heading?.title || "Software Engineer",
        description: (hero as any).bio || "",
        tagline: (hero as any).badge?.text,
      };
    }

    if (about) {
      context.about = {
        title: (about as any).title || "About Me",
        content: (about as any).content || (about as any).bio || "",
      };
    }

    if (skills && skills.length > 0) {
      context.skills = skills.map((skill: any) => ({
        name: skill.name,
        category: skill.category || "Other",
        level: skill.level || "Intermediate",
      }));
    }

    if (experience && experience.length > 0) {
      context.experience = experience.map((exp: any) => ({
        company: exp.company,
        position: exp.position,
        description: exp.description || "",
        startDate: exp.startDate
          ? new Date(exp.startDate).toLocaleDateString()
          : "N/A",
        endDate: exp.endDate
          ? new Date(exp.endDate).toLocaleDateString()
          : undefined,
        current: exp.current || false,
      }));
    }

    if (projects && projects.length > 0) {
      context.projects = projects.map((project: any) => ({
        title: project.title,
        description: project.description || "",
        technologies: project.technologies || [],
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
      }));
    }

    if (blogs && blogs.length > 0) {
      context.blogs = blogs.map((blog: any) => ({
        title: blog.title,
        excerpt: blog.excerpt || blog.description || "",
        slug: blog.slug,
        tags: blog.tags || [],
      }));
    }

    return context;
  } catch (error) {
    console.error("Error fetching portfolio context:", error);
    // Return minimal context if database fetch fails
    return {
      hero: {
        name: "Amir Hamza",
        title: "Software Engineer & Technical Writer",
        description:
          "Passionate about building amazing web experiences with modern technologies.",
      },
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    console.log("📝 Received message:", message);

    // Fetch real portfolio data from database
    console.log("📊 Fetching portfolio context...");
    const portfolioContext = await fetchPortfolioContext();
    console.log("✅ Portfolio context fetched:", Object.keys(portfolioContext));

    // Generate AI response using Gemini with streaming
    console.log("🤖 Generating AI response with streaming...");

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reply = await generateGeminiResponse(
            message,
            portfolioContext,
            history || []
          );

          // Stream the response word by word for smooth effect
          const words = reply.split(" ");
          for (let i = 0; i < words.length; i++) {
            const chunk = i === 0 ? words[i] : " " + words[i];
            controller.enqueue(encoder.encode(chunk));
            // Small delay for smooth streaming effect
            await new Promise((resolve) => setTimeout(resolve, 30));
          }

          controller.close();
        } catch (error: any) {
          console.error("❌ Streaming error:", error);
          const errorMsg =
            "I encountered an error processing your request. Please try again.";
          controller.enqueue(encoder.encode(errorMsg));
          controller.close();
        }
      },
    });

    console.log("✅ Streaming response initiated");

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("❌ Chat API error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      {
        reply:
          "I encountered an error processing your request. Please try again or rephrase your question.",
      },
      { status: 200 }
    );
  }
}
