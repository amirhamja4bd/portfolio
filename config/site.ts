export const siteConfig = {
  name: "Amir Hamza",
  title: "Software Engineer & Technical Writer",
  url: "https://example.com",
  mail: "mailto:hello@example.com",
  github: "https://github.com/amir",
  linkedin: "https://www.linkedin.com/in/amir/",
  resume: "/resume.pdf",
  sections: [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "blog", label: "Blog" },
    { id: "contact", label: "Contact" },
  ],
} as const;

export type SiteSection = (typeof siteConfig.sections)[number];
