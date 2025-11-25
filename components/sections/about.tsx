"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import AboutSkeleton from "../skeleton/AboutSkeleton";

type TabType = "snapshot" | "education" | "certifications" | "interests";

interface InfoCard {
  title: string;
  description: string;
}

interface SnapshotItem {
  label: string;
  value: string;
}

interface EducationItem {
  school: string;
  degree: string;
  year: string;
}

interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
}

interface InterestItem {
  icon: string;
  title: string;
  description: string;
}

interface AboutData {
  title: string;
  description: string;
  infoCards: InfoCard[];
  snapshot: {
    title: string;
    items: SnapshotItem[];
  };
  education: {
    title: string;
    items: EducationItem[];
  };
  certifications: {
    title: string;
    items: CertificationItem[];
  };
  interests: {
    title: string;
    description: string;
    items: InterestItem[];
  };
}

const defaultAboutData: AboutData = {
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
};

const tabs = [
  { id: "snapshot" as TabType, label: "Snapshot" },
  { id: "education" as TabType, label: "Education" },
  { id: "certifications" as TabType, label: "Certifications" },
  { id: "interests" as TabType, label: "Interests" },
];

export function AboutSection() {
  const [activeTab, setActiveTab] = useState<TabType>("snapshot");
  const [aboutData, setAboutData] = useState<AboutData>(defaultAboutData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch("/api/about");
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setAboutData(result.data);
          }
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (isLoading) {
    return <AboutSkeleton />;
  }

  return (
    <section id="about" className="relative scroll-mt-24">
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-semibold lg:text-4xl">
            {aboutData.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {aboutData.description}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {aboutData.infoCards.map((card) => (
              <InfoCard
                key={card.title}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="space-y-4"
        >
          {/* Animated Tabs Navigation */}
          <div className="rounded-2xl border border-border/60 bg-background/70 p-2 shadow-lg backdrop-blur">
            <div className="relative flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative z-10 flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/80"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="rounded-2xl border border-border/60 bg-background/70 shadow-lg backdrop-blur overflow-hidden min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === "snapshot" && (
                <motion.div
                  key="snapshot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
                    {aboutData.snapshot.title}
                  </h3>
                  <dl className="mt-6 grid gap-4 text-sm text-muted-foreground">
                    {aboutData.snapshot.items.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start justify-between gap-6"
                      >
                        <dt className="font-medium text-foreground">
                          {item.label}
                        </dt>
                        <dd
                          className={
                            item.label === "Focus Areas" ? "text-right" : ""
                          }
                        >
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              )}

              {activeTab === "education" && (
                <motion.div
                  key="education"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
                    {aboutData.education.title}
                  </h3>
                  <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
                    {aboutData.education.items.map((item, index) => (
                      <motion.li
                        key={item.school}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start justify-between gap-6 pb-4 border-b border-border/40 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {item.school}
                          </p>
                          <p className="mt-1">{item.degree}</p>
                        </div>
                        <span className="text-muted-foreground/70 font-medium">
                          {item.year}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {activeTab === "certifications" && (
                <motion.div
                  key="certifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
                    {aboutData.certifications.title}
                  </h3>
                  <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
                    {aboutData.certifications.items.map((cert, index) => (
                      <motion.li
                        key={cert.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start justify-between gap-6 pb-4 border-b border-border/40 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {cert.name}
                          </p>
                          <p className="mt-1">{cert.issuer}</p>
                        </div>
                        <span className="text-muted-foreground/70 font-medium">
                          {cert.year}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {activeTab === "interests" && (
                <motion.div
                  key="interests"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
                    {aboutData.interests.title}
                  </h3>
                  <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                    <p>{aboutData.interests.description}</p>
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/40">
                      {aboutData.interests.items.map((interest) => (
                        <div
                          key={interest.title}
                          className="rounded-lg bg-background/50 p-3"
                        >
                          <p className="font-medium text-foreground">
                            {interest.icon} {interest.title}
                          </p>
                          <p className="text-xs mt-1">{interest.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface InfoCardProps {
  title: string;
  description: string;
}

function InfoCard({ title, description }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-lg backdrop-blur">
      <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
        {title}
      </h3>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
