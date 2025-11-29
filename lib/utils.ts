import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date as a relative time string (e.g. "a minute ago", "2 hours ago").
 * Accepts Date | string | number. Returns an empty string for invalid input.
 */
export function timeAgo(
  input: Date | string | number | null | undefined,
  now = new Date()
): string {
  if (!input) return "";
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";

  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  const isFuture = diff < 0;
  const sec = Math.abs(diff);

  const units = [
    { value: 60, name: "second" },
    { value: 60, name: "minute" },
    { value: 24, name: "hour" },
    { value: 30, name: "day" },
    { value: 12, name: "month" },
    { value: Infinity, name: "year" },
  ];

  let amount = sec;
  let unitName = "second";
  for (let i = 0; i < units.length; i++) {
    const { value, name } = units[i];
    if (amount < value) {
      unitName = name;
      break;
    }
    amount = Math.floor(amount / value);
  }

  // Pluralize
  const rounded = Math.max(1, Math.floor(amount));
  const plural = rounded > 1 ? "s" : "";
  const prefix = isFuture ? "in" : "";

  // Natural language for some counts
  if (!isFuture) {
    if (rounded === 1 && unitName === "minute") return "a minute ago";
    if (rounded === 1 && unitName === "hour") return "an hour ago";
    if (rounded === 1 && unitName === "day") return "1 day ago";
    if (rounded === 1 && unitName === "second") return "just now";
  }

  if (isFuture) {
    if (rounded === 1 && unitName === "minute") return "in a minute";
    if (rounded === 1 && unitName === "hour") return "in an hour";
    if (rounded === 1 && unitName === "second") return "in a second";
  }

  return isFuture
    ? `${prefix} ${rounded} ${unitName}${plural}`
    : `${rounded} ${unitName}${plural} ago`;
}
