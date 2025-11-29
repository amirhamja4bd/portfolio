import type { JSONContent } from "novel";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderMarks(text: string, marks?: any[]) {
  if (!marks || marks.length === 0) return text;
  return marks.reduce((acc, m) => {
    switch (m.type) {
      case "bold":
        return `<strong>${acc}</strong>`;
      case "italic":
        return `<em>${acc}</em>`;
      case "code":
        return `<code>${acc}</code>`;
      case "link":
        return `<a href="${escapeHtml(m.attrs?.href || "")}">${acc}</a>`;
      default:
        return acc;
    }
  }, text);
}

function renderInline(node: any): string {
  if (!node) return "";
  if (node.type === "text") {
    let text = escapeHtml(node.text || "");
    if (node.marks) text = renderMarks(text, node.marks);
    return text;
  }
  if (node.type === "image") {
    const src = escapeHtml(node.attrs?.src || "");
    const alt = escapeHtml(node.attrs?.alt || "");
    const title = escapeHtml(node.attrs?.title || "");
    return `<img src="${src}" alt="${alt}"${
      title ? ` title="${title}"` : ""
    }/>`;
  }
  // Fallback: render children if present
  if (node.content && node.content.length) {
    return node.content.map(renderInline).join("");
  }
  return "";
}

function renderNode(node: any): string {
  if (!node) return "";
  switch (node.type) {
    case "paragraph":
      return `<p>${(node.content || []).map(renderInline).join("")}</p>`;
    case "heading": {
      const level = node.attrs?.level || 1;
      return `<h${level}>${(node.content || [])
        .map(renderInline)
        .join("")}</h${level}>`;
    }
    case "codeBlock":
      return `<pre><code>${escapeHtml(
        (node.content || []).map((c: any) => c.text || "").join("\n")
      )}</code></pre>`;
    case "bulletList":
      return `<ul>${(node.content || []).map(renderNode).join("")}</ul>`;
    case "orderedList":
      return `<ol>${(node.content || []).map(renderNode).join("")}</ol>`;
    case "listItem":
      return `<li>${(node.content || []).map(renderNode).join("")}</li>`;
    case "image":
      return renderInline(node);
    default:
      if (node.content && node.content.length) {
        return node.content.map(renderNode).join("");
      }
      return "";
  }
}

export default function docToHtml(doc: JSONContent | null | undefined): string {
  if (!doc) return "";
  try {
    if ((doc as any).type === "doc" && (doc as any).content) {
      return (doc as any).content.map(renderNode).join("\n");
    }
    // If it's not a doc, just return empty or stringify
    return JSON.stringify(doc);
  } catch (err) {
    console.error("Failed to convert doc to HTML", err);
    return JSON.stringify(doc);
  }
}
