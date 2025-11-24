"use client";

import HeroPage from "./Hero";

type SocialLink = {
  icon: string;
  title: string;
  link: string;
};

type HeroData = {
  heading: {
    name: string;
    title: string;
  };
  badge: {
    text: string;
  };
  bio: string;
  cta: {
    primary: {
      text: string;
      href: string;
    };
    secondary: {
      text: string;
      href: string;
    };
  };
  socialLinks: SocialLink[];
  techStack: string[];
  published: boolean;
};

export default function HeroPages() {
  return <HeroPage />;
}
