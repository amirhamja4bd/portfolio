export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
    role: string
  }
  publishedAt: string
  readTime: string
  thumbnail: string
  category: string
  tags: string[]
  featured: boolean
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable React Applications with Modern Architecture",
    slug: "building-scalable-react-applications",
    excerpt:
      "Learn the best practices for structuring large React applications with clean architecture principles and modern tooling.",
    content: `
## Introduction

Building scalable React applications requires careful planning and adherence to proven architectural patterns. In this comprehensive guide, we'll explore the key principles that separate maintainable codebases from technical debt nightmares.

## The Foundation: Project Structure

A well-organized project structure is the cornerstone of any scalable application. Here's the approach I recommend:

\`\`\`
src/
├── components/     # Reusable UI components
├── features/       # Feature-based modules
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── services/       # API and external services
└── types/          # TypeScript definitions
\`\`\`

## State Management Strategy

The choice of state management can make or break your application's scalability. Modern React applications benefit from a hybrid approach:

- **Local State**: useState for component-specific data
- **Server State**: React Query or SWR for API data
- **Global State**: Zustand or Jotai for shared client state

## Performance Optimization

React 18 introduced concurrent features that dramatically improve perceived performance. Key techniques include:

1. **Code Splitting**: Dynamic imports for route-based splitting
2. **Memoization**: Strategic use of useMemo and useCallback
3. **Virtualization**: Rendering only visible items in long lists

## Testing Strategy

A robust testing pyramid ensures confidence in your codebase:

- Unit tests for utility functions and hooks
- Integration tests for feature workflows
- E2E tests for critical user journeys

## Conclusion

Scalable architecture isn't about following trends—it's about making intentional decisions that support long-term maintainability. Start with these foundations and adapt as your application grows.
    `,
    author: {
      name: "Alex Chen",
      avatar: "/professional-developer-portrait.png",
      role: "Senior Frontend Engineer",
    },
    publishedAt: "2024-12-01",
    readTime: "8 min read",
    thumbnail: "/modern-code-editor-with-react-components-dark-them.jpg",
    category: "Development",
    tags: ["React", "Architecture", "TypeScript", "Performance"],
    featured: true,
  },
  {
    id: "2",
    title: "The Art of Crafting Beautiful User Interfaces",
    slug: "crafting-beautiful-user-interfaces",
    excerpt:
      "Discover the design principles and techniques that transform ordinary interfaces into delightful user experiences.",
    content: `
## The Psychology of Great Design

Beautiful interfaces aren't just aesthetically pleasing—they communicate trust, guide attention, and create emotional connections with users.

## Visual Hierarchy

Establishing clear visual hierarchy helps users navigate your interface intuitively:

- **Size**: Larger elements draw more attention
- **Color**: Strategic use of accent colors guides focus
- **Spacing**: Whitespace creates breathing room and grouping
- **Typography**: Font weight and size establish importance

## The Power of Micro-interactions

Subtle animations and feedback mechanisms make interfaces feel alive:

- Button hover states that invite interaction
- Loading indicators that manage expectations
- Success animations that celebrate user actions

## Color Theory in Practice

Color choices impact both aesthetics and usability:

1. **Contrast**: Ensure text remains readable
2. **Consistency**: Limit your palette to 3-5 colors
3. **Accessibility**: Test with color blindness simulators

## Responsive Design Philosophy

Modern interfaces must adapt gracefully across devices:

- Mobile-first approach for core functionality
- Progressive enhancement for larger screens
- Touch-friendly targets and gestures

## Conclusion

Great UI design balances form and function. Focus on solving user problems while creating moments of delight, and you'll craft interfaces people love to use.
    `,
    author: {
      name: "Sarah Mitchell",
      avatar: "/creative-designer-portrait-woman.jpg",
      role: "UI/UX Designer",
    },
    publishedAt: "2024-11-28",
    readTime: "6 min read",
    thumbnail: "/beautiful-ui-design-mockup-glassmorphism-dark.jpg",
    category: "Design",
    tags: ["UI Design", "UX", "Visual Design", "Accessibility"],
    featured: true,
  },
  {
    id: "3",
    title: "Mastering TypeScript: Advanced Patterns for Production Apps",
    slug: "mastering-typescript-advanced-patterns",
    excerpt:
      "Deep dive into TypeScript's advanced features and patterns that will level up your production code quality.",
    content: `
## Beyond Basic Types

TypeScript's true power lies in its advanced type system. Let's explore patterns that make your code both safer and more expressive.

## Discriminated Unions

Perfect for handling different states in your application:

\`\`\`typescript
type ApiState<T> = 
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }
\`\`\`

## Generic Constraints

Create flexible yet type-safe abstractions:

\`\`\`typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
\`\`\`

## Utility Types in Depth

Master the built-in utility types:

- **Partial<T>**: Make all properties optional
- **Required<T>**: Make all properties required
- **Pick<T, K>**: Select specific properties
- **Omit<T, K>**: Exclude specific properties

## Type Guards

Runtime type checking with compile-time benefits:

\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}
\`\`\`

## Conclusion

TypeScript's advanced features enable you to write code that's both flexible and bulletproof. Invest time in mastering these patterns, and your future self will thank you.
    `,
    author: {
      name: "Marcus Johnson",
      avatar: "/software-engineer-portrait-man-glasses.jpg",
      role: "Staff Engineer",
    },
    publishedAt: "2024-11-25",
    readTime: "10 min read",
    thumbnail: "/typescript-code-on-monitor-dark-theme-blue-accent.jpg",
    category: "Development",
    tags: ["TypeScript", "JavaScript", "Programming", "Best Practices"],
    featured: false,
  },
  {
    id: "4",
    title: "The Future of Web Development: What's Coming in 2025",
    slug: "future-of-web-development-2025",
    excerpt:
      "Explore the emerging trends and technologies that will shape how we build for the web in the coming year.",
    content: `
## The Landscape is Shifting

Web development continues to evolve at a rapid pace. Here's what's on the horizon for 2025.

## AI-Assisted Development

AI tools are transforming how we write code:

- Intelligent code completion and generation
- Automated testing and bug detection
- Natural language to code translation

## Edge Computing Goes Mainstream

Running code closer to users brings unprecedented performance:

- Edge functions for dynamic content
- Distributed databases
- Global state synchronization

## WebAssembly Maturation

WASM is finally hitting its stride:

- Component model standardization
- Better tooling and debugging
- Hybrid JS/WASM applications

## New CSS Capabilities

CSS continues to absorb JavaScript's responsibilities:

- Container queries for responsive components
- Scroll-driven animations
- Native nesting and scoping

## The Rise of Server Components

React Server Components are reshaping architecture:

- Reduced client bundle sizes
- Streaming for faster time-to-content
- Simplified data fetching patterns

## Conclusion

The future of web development is exciting. Stay curious, experiment with new technologies, and focus on fundamentals—they'll serve you well regardless of which trends stick.
    `,
    author: {
      name: "Elena Rodriguez",
      avatar: "/tech-leader-woman-portrait-professional.jpg",
      role: "Tech Lead",
    },
    publishedAt: "2024-11-20",
    readTime: "7 min read",
    thumbnail: "/futuristic-web-development-concept-abstract.jpg",
    category: "Trends",
    tags: ["Web Development", "AI", "Future Tech", "Trends"],
    featured: true,
  },
  {
    id: "5",
    title: "Building a Design System from Scratch",
    slug: "building-design-system-from-scratch",
    excerpt: "A practical guide to creating a cohesive design system that scales with your team and product.",
    content: `
## Why Design Systems Matter

A design system is more than a component library—it's a shared language that unifies your product experience.

## Starting with Foundations

Build your system on solid foundations:

- **Colors**: Define primary, secondary, and semantic colors
- **Typography**: Establish a type scale and font choices
- **Spacing**: Create a consistent spacing system
- **Elevation**: Define shadow and depth levels

## Component Architecture

Structure components for maximum reusability:

1. **Primitives**: Basic building blocks (Button, Input, Text)
2. **Composites**: Combined primitives (SearchBar, Card)
3. **Patterns**: Reusable layouts and behaviors

## Documentation is Key

Your design system is only as good as its documentation:

- Interactive component playgrounds
- Usage guidelines and best practices
- Migration guides for updates

## Adoption Strategy

Getting teams to use your system requires:

- Champion advocates in each team
- Clear migration paths
- Regular feedback loops

## Conclusion

A well-crafted design system accelerates development and ensures consistency. Start small, iterate based on real needs, and watch your product experience transform.
    `,
    author: {
      name: "David Park",
      avatar: "/design-systems-expert-portrait.jpg",
      role: "Design Systems Lead",
    },
    publishedAt: "2024-11-15",
    readTime: "9 min read",
    thumbnail: "/design-system-components-organized-dark-theme.jpg",
    category: "Design",
    tags: ["Design Systems", "UI Components", "Documentation", "Scalability"],
    featured: false,
  },
  {
    id: "6",
    title: "Optimizing Web Performance: A Complete Guide",
    slug: "optimizing-web-performance-guide",
    excerpt: "Master the techniques and tools for building blazing-fast web applications that users love.",
    content: `
## Performance is a Feature

Fast websites convert better, rank higher, and create happier users. Here's how to achieve peak performance.

## Core Web Vitals

Google's metrics that matter:

- **LCP**: Largest Contentful Paint (loading)
- **INP**: Interaction to Next Paint (interactivity)
- **CLS**: Cumulative Layout Shift (visual stability)

## Image Optimization

Images are often the biggest performance culprits:

- Use modern formats (WebP, AVIF)
- Implement responsive images
- Lazy load below-the-fold content

## JavaScript Performance

Keep your bundles lean:

1. Tree shaking unused code
2. Code splitting by route
3. Dynamic imports for heavy features

## Caching Strategies

Leverage browser and CDN caching:

- Immutable assets with content hashing
- Stale-while-revalidate patterns
- Service workers for offline support

## Monitoring and Measurement

You can't improve what you don't measure:

- Real user monitoring (RUM)
- Synthetic testing in CI/CD
- Performance budgets

## Conclusion

Web performance optimization is an ongoing journey. Start with the biggest wins, measure everything, and continuously iterate toward faster experiences.
    `,
    author: {
      name: "James Wilson",
      avatar: "/performance-engineer-portrait.jpg",
      role: "Performance Engineer",
    },
    publishedAt: "2024-11-10",
    readTime: "11 min read",
    thumbnail: "/web-performance-metrics-dashboard-dark.jpg",
    category: "Development",
    tags: ["Performance", "Core Web Vitals", "Optimization", "Speed"],
    featured: false,
  },
]

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getRelatedPosts(currentSlug: string, category: string): BlogPost[] {
  return blogPosts.filter((post) => post.slug !== currentSlug && post.category === category).slice(0, 3)
}
