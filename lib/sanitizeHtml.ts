import createDOMPurify from "dompurify";

export default function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") return html;
  // Support both ESM and CJS default shapes
  const create = (createDOMPurify as any).default ?? createDOMPurify;
  try {
    const purify = create(window as any);
    if (purify && typeof purify.sanitize === "function") {
      // Ensure class attributes are preserved (so language- class is retained for syntax highlighting)
      return purify.sanitize(html, { ADD_ATTR: ["class"] });
    }
  } catch (e) {
    // ignore errors and return original HTML
  }
  return html;
}
