import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Blog - Amir Hamza",
  description:
    "Deep dives on platform engineering, developer experience, and scaling teams. Real lessons from production systems.",
  openGraph: {
    title: "Technical Blog - Amir Hamza",
    description:
      "Deep dives on platform engineering, developer experience, and scaling teams.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Blog - Amir Hamza",
    description:
      "Deep dives on platform engineering, developer experience, and scaling teams.",
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
