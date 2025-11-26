import DOMPurify from "dompurify";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import remarkGfm from "remark-gfm";

type Props = {
  data: string;
  htmlContentRef?: any;
};

const MarkdownPreview = ({ data, htmlContentRef }: Props) => {
  // If HTML description is used, run highlight.js to highlight code blocks
  useEffect(() => {
    if (!htmlContentRef.current) return;
    htmlContentRef.current.querySelectorAll("pre code").forEach((el: any) => {
      try {
        // @ts-ignore: highlightElement expects an HTMLElement
        hljs.highlightElement(el as HTMLElement);
      } catch (err) {
        // ignore highlighting errors
      }
    });
  }, [data]);
  return (
    <div>
      {typeof data === "string" && /<[^>]+>/.test(data) ? (
        // description contains HTML
        <div
          ref={htmlContentRef}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(data),
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
          }}
        >
          {data}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default MarkdownPreview;
