import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import sanitizeHtml from "./sanitizeHtml";
// Add highlight.js theme to style highlighted blocks (for HTML-in-markdown cases)
import "highlight.js/styles/github-dark.css";

import remarkGfm from "remark-gfm";

type Props = {
  data: string;
  htmlContentRef?: React.RefObject<HTMLDivElement> | any;
};

const MarkdownPreview = ({ data, htmlContentRef }: Props) => {
  // If HTML description is used, run highlight.js to highlight code blocks
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!htmlContentRef?.current) return;
    // Dynamically import highlight.js to avoid SSR issues and only load when needed
    (async () => {
      try {
        const hljsModule = (await import("highlight.js/lib/common")) as any;
        htmlContentRef.current
          .querySelectorAll("pre code")
          .forEach((el: any) => {
            try {
              hljsModule.highlightElement(el as HTMLElement);
            } catch (err) {
              // ignore highlighting errors
            }
          });
      } catch (err) {
        // ignore any dynamic import errors
      }
    })();
  }, [data, htmlContentRef]);
  // Use library helper to safely sanitize HTML on client

  return (
    <div>
      {typeof data === "string" && /<[^>]+>/.test(data) ? (
        // description contains HTML
        <div
          ref={htmlContentRef}
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(data),
          }}
        />
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            a({ children, ...props }: any) {
              return (
                <a
                  {...props}
                  className="text-primary hover:underline"
                  target={props.href?.startsWith("http") ? "_blank" : undefined}
                  rel={
                    props.href?.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {children}
                </a>
              );
            },
            table({ children, ...props }: any) {
              return (
                <div className="overflow-x-auto">
                  <table {...props}>{children}</table>
                </div>
              );
            },
          }}
        >
          {data}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default MarkdownPreview;
