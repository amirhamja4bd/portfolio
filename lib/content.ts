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
  excerpt: string;
  tags: string[];
  readingTime: string;
  publishedAt: string;
}

export interface BlogPost extends BlogPostPreview {
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  coverImage: string;
  views?: number;
}

export const blogPostsData: BlogPost[] = [
  {
    id: "rsc-data",
    title: "Production Patterns for Next.js Server Components",
    slug: "nextjs-server-components-patterns",
    excerpt:
      "Distilling lessons learned rolling out RSC at scale, focusing on data orchestration, caching, and developer ergonomics.",
    tags: ["Next.js", "Architecture"],
    readingTime: "8 min read",
    publishedAt: "Sep 24, 2025",
    coverImage:
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Amir Hamza",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      role: "Staff Software Engineer",
    },
    views: 12500,
    content: `
# Production Patterns for Next.js Server Components

React Server Components (RSC) represent a paradigm shift in how we build React applications. After rolling out RSC across multiple production applications at Atlas Systems, I've learned valuable lessons about data orchestration, caching strategies, and developer ergonomics.

## The Promise of Server Components

Server Components allow us to:
- Reduce client-side JavaScript bundles significantly
- Access backend resources directly without API routes
- Improve initial page load performance
- Build more secure applications by keeping sensitive logic on the server

## Pattern 1: Data Orchestration

One of the most powerful patterns is parallel data fetching with Server Components:

\`\`\`typescript
async function ProductPage({ params }: { params: { id: string } }) {
  // These fetch in parallel automatically
  const [product, reviews, recommendations] = await Promise.all([
    fetchProduct(params.id),
    fetchReviews(params.id),
    fetchRecommendations(params.id),
  ]);

  return (
    <div>
      <ProductDetails product={product} />
      <ReviewsList reviews={reviews} />
      <Recommendations items={recommendations} />
    </div>
  );
}
\`\`\`

This pattern eliminates waterfalls that plague traditional client-side fetching.

## Pattern 2: Smart Caching Strategy

Next.js 14+ provides granular caching controls. Here's our production setup:

\`\`\`typescript
// Revalidate every hour for semi-dynamic content
export const revalidate = 3600;

async function BlogPost({ slug }: { slug: string }) {
  const post = await fetch(\`https://api.example.com/posts/\${slug}\`, {
    next: { revalidate: 3600 }
  });
  
  return <Article data={post} />;
}
\`\`\`

For highly dynamic data, we use on-demand revalidation with webhooks from our CMS.

## Pattern 3: Progressive Enhancement

Server Components shouldn't mean abandoning interactivity. Our approach:

1. **Server Component for shell** - Static, SEO-critical content
2. **Client Components for interactions** - Forms, animations, real-time features
3. **Suspense boundaries** - Graceful loading states

\`\`\`typescript
import { Suspense } from 'react';
import ClientForm from './client-form';

export default async function Page() {
  const initialData = await fetchData();
  
  return (
    <div>
      <ServerRenderedContent data={initialData} />
      <Suspense fallback={<FormSkeleton />}>
        <ClientForm />
      </Suspense>
    </div>
  );
}
\`\`\`

## Performance Wins

After implementing these patterns:
- **First Contentful Paint**: Improved by 45%
- **Time to Interactive**: Reduced by 38%
- **Bundle Size**: Decreased from 280KB to 120KB

## Developer Experience

The DX improvements have been remarkable. Our team velocity increased as developers no longer need to:
- Write and maintain API routes for simple data fetching
- Manage complex client-side state for server data
- Debug race conditions in useEffect hooks

## Challenges We Faced

Not everything was smooth:

1. **Mental Model Shift**: Training the team took ~2 sprints
2. **Third-party Libraries**: Some weren't RSC-compatible
3. **Testing Strategy**: Had to evolve our testing approach

## Conclusion

Server Components are production-ready and deliver real value. Start with read-heavy pages, establish patterns, and gradually migrate. The investment pays off in performance, developer velocity, and user experience.

---

*Have questions about RSC adoption? Reach out on LinkedIn or check out our [DX Foundations Platform](/projects/dx-foundations-platform) for more details on how we scaled this across 120+ services.*
    `,
  },
  {
    id: "platform-flight",
    title: "Designing Reliable Feature Flags for 200+ Teams",
    slug: "feature-flags-at-scale",
    excerpt:
      "Composable guardrails, experimentation primitives, and measuring impact without slowing down delivery.",
    tags: ["Platform", "Leadership"],
    readingTime: "6 min read",
    publishedAt: "Jul 10, 2025",
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Amir Hamza",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      role: "Staff Software Engineer",
    },
    views: 8900,
    content: `
# Designing Reliable Feature Flags for 200+ Teams

Feature flags are essential for modern software delivery, but at scale, they become a liability without proper design. Here's how we built a feature flag system that serves 200+ engineering teams without becoming a bottleneck.

## The Problem Space

When you have hundreds of teams shipping features daily, feature flags can become:
- **Technical debt sources** - Flags that never get cleaned up
- **Performance bottlenecks** - Slow flag evaluation blocking critical paths
- **Compliance risks** - Inconsistent targeting creating data exposure

## Core Design Principles

### 1. Flags Are Temporary by Default

Every flag has a lifecycle:

\`\`\`typescript
interface FeatureFlag {
  key: string;
  type: 'temporary' | 'permanent' | 'ops';
  createdAt: Date;
  expiresAt?: Date;
  owner: string;
  jiraTicket: string;
}
\`\`\`

Temporary flags expire automatically after 90 days. Teams get Slack reminders at 60 days.

### 2. Composable Targeting Rules

Instead of complex boolean logic, we use composable matchers:

\`\`\`typescript
const targeting = {
  and: [
    { userSegment: 'beta-users' },
    { not: { company: 'competitor-co' } },
    { percentage: 50 }
  ]
};
\`\`\`

This is both readable and debuggable in production.

### 3. Type-Safe Flags

TypeScript integration prevents runtime errors:

\`\`\`typescript
const { enabled, variant } = useFeatureFlag('new-checkout-flow');

if (enabled && variant === 'streamlined') {
  return <StreamlinedCheckout />;
}
\`\`\`

Code completion and type checking catch flag misuse at build time.

## Performance at Scale

### Edge Evaluation

We evaluate flags at the CDN edge using Vercel Edge Config:

\`\`\`typescript
import { get } from '@vercel/edge-config';

export default async function middleware(request: NextRequest) {
  const flags = await get('feature-flags');
  
  // Sub-millisecond flag evaluation
  const newUI = evaluateFlag(flags.newUI, request);
  
  if (newUI) {
    return NextResponse.rewrite(new URL('/new-ui', request.url));
  }
}
\`\`\`

**Result**: Flag evaluation adds <2ms latency globally.

### Client-Side Optimization

For browser flags, we bootstrap at page load:

\`\`\`typescript
export default function RootLayout({ children }) {
  const flags = await getServerFlags();
  
  return (
    <FlagProvider initialFlags={flags}>
      {children}
    </FlagProvider>
  );
}
\`\`\`

Zero network requests for flag checks after initial load.

## Guardrails & Safety

### Automated Rollback

Flags integrate with our observability stack:

\`\`\`typescript
flagConfig({
  key: 'new-payment-flow',
  rollback: {
    errorRateThreshold: 0.05, // 5% error rate
    latencyP99Threshold: 2000, // 2s
    window: '5m'
  }
});
\`\`\`

If error rates or latency spike, the flag auto-disables and pages on-call.

### Compliance Controls

For regulated features:

\`\`\`typescript
const flag = defineFlag({
  key: 'pii-export',
  requiresApproval: true,
  approvers: ['security-team', 'legal'],
  auditLog: true
});
\`\`\`

Changes require multi-party approval and generate audit trails.

## Experimentation Primitives

Flags double as A/B test infrastructure:

\`\`\`typescript
const variant = useExperiment('checkout-redesign', {
  variants: ['control', 'variant-a', 'variant-b'],
  allocation: [0.33, 0.33, 0.34],
  metrics: ['conversion-rate', 'cart-abandonment']
});
\`\`\`

Analytics automatically track metrics per variant.

## Measuring Impact

We track flag health with a dashboard:

- **Active flags by age** - Identify debt
- **Evaluation latency P99** - Performance regression
- **Override usage** - Find problematic flags
- **Rollback frequency** - System reliability

## Results

After 18 months in production:
- **99.99% flag evaluation uptime**
- **Mean flag lifetime**: 28 days (down from 180+)
- **Zero flag-related incidents** in past year
- **<5ms P99 latency** globally

## Key Takeaways

1. Make flags first-class citizens with lifecycle management
2. Optimize for edge evaluation to minimize latency
3. Build safety into the system, not the process
4. Integrate experimentation from day one
5. Measure and visualize flag health

Feature flags at scale require platform thinking, not just a library. Invest early in the architecture, and it'll pay dividends as you grow.

---

*Interested in our platform approach? Check out the [DX Foundations Platform](/projects/dx-foundations-platform) case study.*
    `,
  },
  {
    id: "ai-infra",
    title: "LLM Infrastructure Lessons from Building AI Tutor",
    slug: "llm-infrastructure-lessons",
    excerpt:
      "What it takes to ship deterministic experiences on top of probabilistic systems, from evaluations to cost controls.",
    tags: ["AI", "Infrastructure"],
    readingTime: "9 min read",
    publishedAt: "May 4, 2025",
    coverImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Amir Hamza",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      role: "Staff Software Engineer",
    },
    views: 15200,
    content: `
# LLM Infrastructure Lessons from Building AI Tutor

Building [AI Tutor](/projects/ai-tutor) taught us hard lessons about production LLM systems. Here's what it takes to ship deterministic experiences on top of probabilistic AI models.

## The Challenge

LLMs are fundamentally different from traditional software:
- **Non-deterministic outputs** even with the same input
- **Hallucination risks** requiring constant validation
- **Cost unpredictability** scaling with usage
- **Latency variability** from 200ms to 30+ seconds

## Architecture Overview

Our stack:
- **LangChain** for orchestration
- **OpenAI GPT-4** for generation
- **Pinecone** for vector storage
- **Supabase** for structured data
- **Vercel** for edge streaming

\`\`\`
User Query → Edge Function → Vector Search → Context Assembly 
→ LLM Call → Stream Response → Store Feedback
\`\`\`

## Lesson 1: Evaluation-Driven Development

Traditional testing doesn't work for LLMs. We built an evaluation harness:

\`\`\`typescript
interface EvalCase {
  input: string;
  expectedCriteria: {
    containsKeywords?: string[];
    sentiment?: 'positive' | 'neutral' | 'negative';
    factuallyCorrect?: boolean;
    followsFormat?: RegExp;
  };
}

async function evaluateModel(cases: EvalCase[]) {
  const results = await Promise.all(
    cases.map(async (testCase) => {
      const response = await llm.generate(testCase.input);
      return gradeResponse(response, testCase.expectedCriteria);
    })
  );
  
  return {
    accuracy: results.filter(r => r.passed).length / results.length,
    failures: results.filter(r => !r.passed)
  };
}
\`\`\`

We run this on every deployment. **90%+ pass rate** required to ship.

### Automated Regression Detection

When a response quality drops:

\`\`\`typescript
// Store baseline evaluations
await db.evaluations.create({
  modelVersion: 'gpt-4-turbo-2024-04-09',
  prompt: promptTemplate,
  accuracy: 0.94,
  timestamp: new Date()
});

// Compare on each change
if (newAccuracy < baselineAccuracy - 0.05) {
  throw new Error('Regression detected!');
}
\`\`\`

## Lesson 2: Prompt Engineering as Code

Prompts are business logic. We version them:

\`\`\`typescript
// prompts/tutor-v3.ts
export const tutorPrompt = {
  version: 'v3.1',
  template: \`
You are an expert software engineering tutor.

Context:
{context}

User Question:
{question}

Guidelines:
- Provide concrete code examples
- Explain the "why" not just the "how"
- Reference official documentation
- Keep responses under 300 words

Response:
\`,
  variables: ['context', 'question'] as const,
  validations: {
    maxTokens: 500,
    temperature: 0.3
  }
};
\`\`\`

Changes go through PR review with eval results attached.

## Lesson 3: Context is Everything

RAG (Retrieval Augmented Generation) quality determines response quality:

### Chunking Strategy

We tested multiple approaches:

| Strategy | Chunk Size | Overlap | Retrieval Accuracy |
|----------|-----------|---------|-------------------|
| Paragraph | ~200 tokens | 0 | 72% |
| Semantic | ~400 tokens | 50 | 84% |
| **Recursive** | **~500 tokens** | **100** | **91%** ✓ |

Recursive chunking with markdown awareness won.

### Hybrid Search

Vector search alone missed exact matches. We combine:

\`\`\`typescript
async function hybridSearch(query: string) {
  const [vectorResults, keywordResults] = await Promise.all([
    pinecone.query({ vector: embed(query), topK: 5 }),
    fullTextSearch(query, { topK: 5 })
  ]);
  
  // Reciprocal Rank Fusion
  return mergeResults(vectorResults, keywordResults);
}
\`\`\`

**Result**: 91% → 96% retrieval accuracy.

## Lesson 4: Cost Control

LLM costs can spiral quickly. Our controls:

### 1. Caching Layers

\`\`\`typescript
// Semantic cache for similar queries
const cacheKey = await generateEmbedding(userQuery);
const cached = await semanticCache.get(cacheKey, threshold=0.95);

if (cached) {
  return cached.response; // $0.00 cost
}

const response = await llm.generate(userQuery); // $$
await semanticCache.set(cacheKey, response);
\`\`\`

**Cache hit rate**: 41% (huge savings)

### 2. Rate Limiting

\`\`\`typescript
const rateLimit = {
  free: '10 requests/hour',
  pro: '100 requests/hour',
  enterprise: 'unlimited'
};

await checkRateLimit(user.tier);
\`\`\`

### 3. Cost Monitoring

Daily alerts when spend exceeds budget:

\`\`\`typescript
const dailyCost = await calculateCost({
  promptTokens,
  completionTokens,
  model: 'gpt-4-turbo'
});

if (dailyCost > BUDGET_THRESHOLD) {
  await alert('Cost threshold exceeded');
  await switchToGPT35(); // Automatic fallback
}
\`\`\`

## Lesson 5: Streaming for UX

Nobody waits 20 seconds for a response. We stream:

\`\`\`typescript
export async function POST(req: Request) {
  const { question } = await req.json();
  
  const stream = await llm.streamGenerate(question);
  
  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(chunk);
        }
        controller.close();
      }
    })
  );
}
\`\`\`

**Perceived latency**: 20s → 0.5s

## Lesson 6: Observability

LLMs need custom monitoring:

\`\`\`typescript
await logLLMCall({
  promptTokens: 450,
  completionTokens: 380,
  latency: 3200,
  cost: 0.042,
  model: 'gpt-4-turbo',
  cached: false,
  userFeedback: null, // Filled later
  hallucinated: false // Flagged by validator
});
\`\`\`

We track:
- **Latency P50/P95/P99** by model
- **Cost per request** trending
- **User satisfaction** (thumbs up/down)
- **Hallucination rate** via validators

## Production Results

After 6 months:
- **94% user satisfaction** rating
- **<$0.15 average cost** per session
- **2.1s median latency** (including streaming)
- **Zero hallucination incidents** in prod

## Key Takeaways

1. **Treat prompts as code** - version, review, test
2. **Build evaluation infrastructure early** - it's your test suite
3. **RAG quality matters more than model choice**
4. **Layer caching aggressively** - semantic cache is a game-changer
5. **Stream everything** - UX > actual latency
6. **Monitor like it's critical infra** - because it is

LLMs are powerful but require platform thinking. Don't treat them like API calls—build proper infrastructure around them.

---

*Check out the full [AI Tutor project](/projects/ai-tutor) for implementation details and live demo.*
    `,
  },
  {
    id: "devops-scaling",
    title: "Scaling CI/CD from 10 to 120 Services",
    slug: "scaling-cicd-pipeline",
    excerpt:
      "How we reduced build times from 45 minutes to 6 minutes and eliminated deployment bottlenecks across the organization.",
    tags: ["DevOps", "Platform"],
    readingTime: "7 min read",
    publishedAt: "Mar 15, 2025",
    coverImage:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Amir Hamza",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      role: "Staff Software Engineer",
    },
    views: 6800,
    content: `
# Scaling CI/CD from 10 to 120 Services

When Atlas Systems grew from 10 to 120 microservices in 18 months, our CI/CD pipeline became the bottleneck. Build times ballooned to 45 minutes, deployments required manual coordination, and developers waited hours for feedback.

Here's how we transformed our delivery infrastructure to support rapid growth while improving developer experience.

## The Starting Point

Our 2021 setup:
- **Jenkins** on EC2 with manual scaling
- **Monolithic build jobs** that tested everything
- **Sequential deployments** to avoid conflicts
- **No caching** between builds
- **45-minute average** build time

With 200+ engineers, this didn't scale.

## Strategy 1: Intelligent Build Orchestration

We migrated to **GitHub Actions** with matrix builds:

\`\`\`yaml
name: CI Pipeline
on: [push, pull_request]

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      services: \${{ steps.filter.outputs.changes }}
    steps:
      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            service-a: 'services/a/**'
            service-b: 'services/b/**'
            
  build:
    needs: detect-changes
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: \${{ fromJSON(needs.detect-changes.outputs.services) }}
    steps:
      - name: Build \${{ matrix.service }}
        run: pnpm build --filter=\${{ matrix.service }}
\`\`\`

**Result**: Only changed services build. 45min → 12min average.

## Strategy 2: Aggressive Caching

### Dependency Caching

\`\`\`yaml
- uses: actions/cache@v3
  with:
    path: |
      ~/.pnpm-store
      **/node_modules
    key: \${{ runner.os }}-pnpm-\${{ hashFiles('**/pnpm-lock.yaml') }}
\`\`\`

### Docker Layer Caching

\`\`\`dockerfile
# Cache dependencies separately
FROM node:18 AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build layer (changes frequently)
FROM node:18 AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build
\`\`\`

**Result**: 12min → 6min with warm cache.

## Strategy 3: Parallel Testing

We split tests into parallel jobs:

\`\`\`yaml
test:
  runs-on: ubuntu-latest
  strategy:
    matrix:
      shard: [1, 2, 3, 4]
  steps:
    - name: Run tests
      run: |
        pnpm test --shard=\${{ matrix.shard }}/4
\`\`\`

Combined with **test impact analysis**:

\`\`\`typescript
// Only run tests affected by changes
const affectedTests = await getAffectedTests(changedFiles);
await runTests(affectedTests);
\`\`\`

**Result**: Full test suite in 4 minutes (was 18 minutes).

## Strategy 4: Progressive Deployment

We implemented automated canary deployments:

\`\`\`yaml
deploy:
  steps:
    - name: Deploy Canary (5%)
      run: kubectl set image deployment/app app=\$IMAGE
      args: --replicas=1
      
    - name: Monitor Metrics
      run: |
        metrics watch \\
          --error-rate-threshold=0.01 \\
          --latency-p99-threshold=500 \\
          --duration=5m
          
    - name: Promote or Rollback
      run: |
        if metrics passed; then
          kubectl scale deployment/app --replicas=20
        else
          kubectl rollout undo deployment/app
        fi
\`\`\`

**Result**: 97% of deployments fully automated, zero-downtime.

## Strategy 5: Developer Self-Service

Built an internal CLI for common operations:

\`\`\`bash
# Create new service from template
dx create service payments-v2

# Deploy to staging
dx deploy staging payments-v2

# Check deployment status
dx status payments-v2

# Rollback if needed
dx rollback payments-v2
\`\`\`

No more Slack messages to DevOps team.

## Observability Integration

Every deployment triggers:

\`\`\`typescript
await notifySlack({
  service: 'payments-api',
  version: 'v2.3.1',
  deployer: 'amir',
  dashboards: [
    'https://grafana.internal/d/payments',
    'https://sentry.io/payments-api'
  ],
  rollbackCommand: 'dx rollback payments-api'
});
\`\`\`

Engineers get instant links to monitor their deployments.

## The Results

After 6 months of iteration:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Build Time (avg) | 45 min | 6 min | **87% faster** |
| Time to Production | 2-3 days | 2-4 hours | **90% faster** |
| Deploy Failures | 8% | 0.3% | **96% reduction** |
| DevOps Ticket Volume | 150/week | 12/week | **92% reduction** |

## Developer Experience Impact

Survey results from our 200+ engineers:

- **94%** say deployment is "easy" or "very easy"
- **87%** deploy to production weekly (was 23%)
- **4.6/5** satisfaction score for CI/CD platform

## Key Lessons

1. **Optimize for change detection** - Don't rebuild the world
2. **Cache everything** - Dependencies, builds, Docker layers
3. **Parallelize ruthlessly** - Matrix builds, test sharding
4. **Automate the critical path** - Deployments, rollbacks, monitoring
5. **Build for self-service** - Empower developers, reduce tickets

## What's Next

We're working on:
- **Preview environments** for every PR
- **Cost attribution** per team
- **AI-powered build optimization**

CI/CD at scale isn't just about tools—it's about building platforms that scale with your organization.

---

*Learn more about our platform work in [DX Foundations Platform](/projects/dx-foundations-platform).*
    `,
  },
  {
    id: "typescript-monorepo",
    title: "Type-Safe Monorepos with TypeScript Project References",
    slug: "typescript-monorepo-setup",
    excerpt:
      "Building maintainable monorepos with proper type checking, incremental builds, and great developer experience.",
    tags: ["TypeScript", "DX"],
    readingTime: "10 min read",
    publishedAt: "Jan 22, 2025",
    coverImage:
      "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Amir Hamza",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      role: "Staff Software Engineer",
    },
    views: 9500,
    content: `
# Type-Safe Monorepos with TypeScript Project References

Monorepos promise code sharing and atomic changes across multiple packages. But without proper TypeScript configuration, they become slow, error-prone, and frustrating.

Here's how we built a type-safe monorepo serving 40+ packages with fast builds and excellent DX.

## Why Project References?

TypeScript Project References enable:
- **Incremental builds** - Only rebuild changed packages
- **Type-safe imports** - Catch errors across package boundaries
- **Better IDE performance** - Fast navigation and autocomplete
- **Logical architecture** - Enforce dependency graph

## Repository Structure

\`\`\`
monorepo/
├── packages/
│   ├── ui/           # React components
│   ├── utils/        # Shared utilities
│   ├── api-client/   # API SDK
│   └── config/       # Shared config
├── apps/
│   ├── web/          # Next.js app
│   ├──         # Admin dashboard
│   └── docs/         # Documentation site
└── tsconfig.json     # Root config
\`\`\`

## Root Configuration

\`\`\`json
// tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/ui" },
    { "path": "./packages/utils" },
    { "path": "./packages/api-client" },
    { "path": "./apps/web" },
    { "path": "./apps/admin" }
  ]
}
\`\`\`

This root config doesn't compile anything—it just orchestrates references.

## Package Configuration

Each package has two configs:

\`\`\`json
// packages/ui/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,           // Enable project references
    "outDir": "./dist",
    "rootDir": "./src",
    "declarationMap": true       // For IDE navigation
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../utils" }       // Dependency on utils
  ]
}
\`\`\`

\`\`\`json
// packages/ui/tsconfig.build.json
{
  "extends": "./tsconfig.json",
  "exclude": [
    "**/*.test.ts",
    "**/*.stories.tsx",
    "**/__tests__/**"
  ]
}
\`\`\`

Separate build config excludes tests from production builds.

## Shared Base Configuration

\`\`\`json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  }
}
\`\`\`

All packages inherit these strict settings.

## Build Script

\`\`\`json
// package.json
{
  "scripts": {
    "build": "tsc --build --verbose",
    "build:watch": "tsc --build --watch",
    "clean": "tsc --build --clean"
  }
}
\`\`\`

TypeScript automatically:
1. Topologically sorts packages
2. Builds dependencies first
3. Only rebuilds changed packages
4. Generates declaration files

## Path Mapping for DX

Instead of relative imports:

\`\`\`typescript
import { Button } from '../../../packages/ui';
\`\`\`

We use workspace imports:

\`\`\`json
// apps/web/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@acme/ui": ["../../packages/ui/src"],
      "@acme/utils": ["../../packages/utils/src"],
      "@acme/api": ["../../packages/api-client/src"]
    }
  }
}
\`\`\`

Now imports are clean:

\`\`\`typescript
import { Button } from '@acme/ui';
\`\`\`

## Enforcing Boundaries

We use ESLint to prevent invalid imports:

\`\`\`javascript
// .eslintrc.js
module.exports = {
  rules: {
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './packages/utils',
            from: './packages/ui',
            message: 'Utils cannot depend on UI'
          }
        ]
      }
    ]
  }
};
\`\`\`

## CI/CD Integration

We cache TypeScript build info:

\`\`\`yaml
# .github/workflows/ci.yml
- uses: actions/cache@v3
  with:
    path: |
      **/tsconfig.tsbuildinfo
      **/dist
    key: \${{ runner.os }}-tsc-\${{ hashFiles('**/*.ts') }}

- name: Type Check
  run: pnpm tsc --build
\`\`\`

**Result**: Type checking in CI went from 8 minutes to 90 seconds.

## Watch Mode for Development

\`\`\`json
{
  "scripts": {
    "dev": "concurrently \\"tsc --build --watch\\" \\"next dev\\""
  }
}
\`\`\`

TypeScript watches all packages and rebuilds incrementally.

## Publishing Strategy

For internal packages, we use TypeScript's composite output:

\`\`\`json
// packages/ui/package.json
{
  "name": "@acme/ui",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "prepublishOnly": "tsc --build tsconfig.build.json"
  }
}
\`\`\`

For external npm packages, we bundle with tsup.

## Performance Optimizations

### 1. Incremental Builds

\`\`\`json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  }
}
\`\`\`

### 2. Assume Changes Only

\`\`\`bash
# Only rebuild packages with changes
tsc --build --assumeChangesOnlyAffectDirectDependencies
\`\`\`

### 3. Parallel Type Checking

We use **Turborepo** for parallel execution:

\`\`\`json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    }
  }
}
\`\`\`

\`\`\`bash
turbo run type-check --parallel
\`\`\`

## IDE Setup (VS Code)

\`\`\`json
// .vscode/settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
\`\`\`

## Common Pitfalls

### 1. Missing Composite Flag

Without \`"composite": true\`, project references don't work.

### 2. Incorrect References

If package A depends on B, you MUST add:

\`\`\`json
{
  "references": [{ "path": "../B" }]
}
\`\`\`

### 3. Direct Source Imports

Don't import from \`src/\`:

\`\`\`typescript
// ❌ Bad
import { util } from '@acme/utils/src/util';

// ✅ Good
import { util } from '@acme/utils';
\`\`\`

## Results

After migrating to project references:

| Metric | Before | After |
|--------|--------|-------|
| Full build time | 4m 30s | 45s |
| Incremental rebuild | 1m 10s | 3s |
| Type error detection | Runtime | Build time |
| IDE responsiveness | Slow | Instant |

## Key Takeaways

1. **Enable composite mode** - It's required for project references
2. **Structure matters** - Organize by dependency graph
3. **Use path mapping** - Better imports, better DX
4. **Enforce boundaries** - Prevent architectural drift
5. **Cache aggressively** - In CI and locally

TypeScript project references unlock true monorepo potential. The upfront setup pays off in speed, safety, and developer happiness.

---

*Building platform tools? Check out our [DX Foundations Platform](/projects/dx-foundations-platform) for more patterns.*
    `,
  },
];

export const blogPosts: BlogPostPreview[] = blogPostsData.map((post) => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  tags: post.tags,
  readingTime: post.readingTime,
  publishedAt: post.publishedAt,
}));

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
