import type { JSONContent } from "novel";

// Convert HTML string to the editor's JSONContent "doc" shape
// This is a small, resilient converter that preserves block structure
// (paragraphs, headings, lists, code blocks, images) and simple inline
// text nodes. It does not attempt to fully rehydrate every HTML feature,
// but is sufficient to render previously-saved project descriptions.
export function htmlToDoc(html: string): JSONContent {
  try {
    if (!html) return { type: "doc", content: [] } as any;
    // DOMParser is only available in the browser environment - guard for SSR
    if (typeof window === "undefined" || typeof DOMParser === "undefined") {
      return { type: "doc", content: [] } as any;
    }

    const doc = new DOMParser().parseFromString(html, "text/html");
    const body = doc.body;

    function convertInline(node: ChildNode): any[] {
      if (!node) return [];
      if (node.nodeType === Node.TEXT_NODE) {
        const text = (node.textContent || "").replace(/\s+/g, " ");
        if (!text.trim()) return [];
        return [{ type: "text", text }];
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return [];
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      switch (tag) {
        case "img": {
          const src =
            el.getAttribute("src") || el.getAttribute("data-src") || "";
          const alt = el.getAttribute("alt") || el.getAttribute("title") || "";
          const title = el.getAttribute("title") || undefined;
          const attrs: any = { src, alt };
          if (title) attrs.title = title;
          return [{ type: "image", attrs }];
        }
        case "strong":
        case "b":
          return Array.from(el.childNodes).flatMap((c) =>
            convertInline(c).map((t) => ({ ...t, marks: [{ type: "bold" }] }))
          );
        case "em":
        case "i":
          return Array.from(el.childNodes).flatMap((c) =>
            convertInline(c).map((t) => ({ ...t, marks: [{ type: "italic" }] }))
          );
        case "a": {
          const href = el.getAttribute("href") || undefined;
          // For anchors, only apply link marks to text nodes. If the child
          // is an inline node such as an image, return it unchanged so we
          // don't attempt to apply marks to non-text nodes (invalid in
          // some editor schemas).
          return Array.from(el.childNodes).flatMap((c) =>
            convertInline(c).map((t) => {
              if (t.type === "text") {
                return { ...t, marks: [{ type: "link", attrs: { href } }] };
              }
              return t;
            })
          );
        }
        case "br":
          return [{ type: "text", text: "\n" }];
        case "code":
          return Array.from(el.childNodes).flatMap((c) =>
            convertInline(c).map((t) => ({ ...t, marks: [{ type: "code" }] }))
          );
        default:
          return Array.from(el.childNodes).flatMap((c) => convertInline(c));
      }
    }

    function convert(node: ChildNode): any | null {
      if (node.nodeType === Node.TEXT_NODE) {
        const t = (node.textContent || "").trim();
        if (!t) return null;
        return { type: "paragraph", content: [{ type: "text", text: t }] };
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return null;
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      switch (tag) {
        case "p":
        case "div": {
          const content = Array.from(el.childNodes).flatMap(convertInline);
          return { type: "paragraph", content };
        }
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6": {
          const level = parseInt(tag.substring(1), 10) || 1;
          const content = Array.from(el.childNodes).flatMap(convertInline);
          return { type: "heading", attrs: { level }, content };
        }
        case "pre": {
          const code = el.querySelector("code");
          const codeText = code ? code.textContent || "" : el.textContent || "";
          return {
            type: "codeBlock",
            content: [{ type: "text", text: codeText }],
          };
        }
        case "img": {
          // Convert a top-level <img> into a paragraph containing an image
          // node so the editor's schema (which expects inline image nodes
          // inside paragraphs) accepts it.
          const src =
            el.getAttribute("src") || el.getAttribute("data-src") || "";
          const alt = el.getAttribute("alt") || el.getAttribute("title") || "";
          const title = el.getAttribute("title") || undefined;
          const attrs: any = { src, alt };
          if (title) attrs.title = title;
          return {
            type: "paragraph",
            content: [{ type: "image", attrs }],
          };
        }
        case "figure": {
          const img = el.querySelector("img");
          if (img) return convert(img as any);
          return null;
        }
        case "ul": {
          const items = Array.from(el.children)
            .filter((c) => c.tagName.toLowerCase() === "li")
            .map((li) => ({
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: Array.from(li.childNodes).flatMap(convertInline),
                },
              ],
            }));
          return { type: "bulletList", content: items };
        }
        case "ol": {
          const items = Array.from(el.children)
            .filter((c) => c.tagName.toLowerCase() === "li")
            .map((li) => ({
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: Array.from(li.childNodes).flatMap(convertInline),
                },
              ],
            }));
          return { type: "orderedList", content: items };
        }
        case "li": {
          const content = Array.from(el.childNodes).flatMap(convertInline);
          return {
            type: "listItem",
            content: [{ type: "paragraph", content }],
          };
        }
        default: {
          const content = Array.from(el.childNodes).flatMap(convertInline);
          if (content.length === 0) return null;
          return { type: "paragraph", content };
        }
      }
    }

    const nodes = Array.from(body.childNodes)
      .map(convert)
      .filter(Boolean) as any[];
    if (nodes.length === 0) return { type: "doc", content: [] } as any;
    return { type: "doc", content: nodes } as any;
  } catch (err) {
    console.error("Failed to convert HTML to editor doc", err);
    return { type: "doc", content: [] } as any;
  }
}

export default htmlToDoc;
