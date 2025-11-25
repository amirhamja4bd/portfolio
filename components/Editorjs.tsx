"use client";
import CodeTool from "@editorjs/code";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
// @ts-ignore
const Embed = require("@editorjs/embed");

interface EditorjsProps {
  initialValue?: any;
  onChange?: (content: string) => void;
}

export default function Editorjs({ initialValue, onChange }: EditorjsProps) {
  // Use any because the actual runtime SDK might be wrapped by bundlers in some envs
  const ejInstance = useRef<any | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!editorRef.current) return;
    if (ejInstance.current) return;
    ejInstance.current = new EditorJS({
      holder: editorRef.current,
      autofocus: true,
      data: initialValue,
      tools: {
        header: Header,
        list: List,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              // Use the Editor.js-friendly endpoint that forwards to our generic /api/upload
              byFile: "/api/upload/editorjs",
              // Fetch remote images (we implement /api/upload/fetch-image)
              byUrl: "/api/upload/fetch-image",
            },
            captionPlaceholder: "Image caption...",
          },
        },
        code: CodeTool,
        quote: Quote,
        table: Table,
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              coub: true,
              instagram: true,
              twitter: true,
              facebook: true,
            },
          },
        },
        inlineCode: InlineCode,
      },
      placeholder: "Start writing your blog post...",
      onReady: () => {
        // Editor is ready
      },
      onChange: async () => {
        // Try to save and send the content upwards on change
        try {
          const inst = ejInstance.current as any;
          if (inst && typeof inst.save === "function") {
            const out = await inst.save();
            onChange?.(JSON.stringify(out));
          }
        } catch (err) {
          // ignore save errors on frequent changes
          console.warn("EditorJS onChange save error:", err);
        }
      },
      // Error handling for Editor.js can be done via try/catch in save or block config
    });
    return () => {
      if (ejInstance.current) {
        const inst = ejInstance.current as any;
        if (typeof inst.destroy === "function") {
          try {
            inst.destroy();
          } catch (err) {
            console.warn("EditorJS destroy threw:", err);
          }
        } else {
          // Not a function or not present — log to help debugging
          console.warn("EditorJS instance has no destroy method:", inst);
        }
      }
      ejInstance.current = null;
    };
  }, [theme]);

  const handleSave = async () => {
    if (ejInstance.current) {
      const inst = ejInstance.current as any;
      if (typeof inst.save === "function") {
        const outputData = await inst.save();
        onChange?.(JSON.stringify(outputData));
        alert(JSON.stringify(outputData, null, 2));
      } else {
        console.warn("EditorJS instance has no save method.");
      }
    }
  };

  return (
    <div
      className={`flex flex-col items-center w-full min-h-screen py-12 ${
        theme === "dark" ? "bg-black" : "bg-background"
      }`}
    >
      <div
        ref={editorRef}
        className={`w-full border rounded-lg p-4 ${
          theme === "dark"
            ? "bg-zinc-900 border-zinc-700"
            : "bg-background border-gray-300"
        }`}
        style={{ minHeight: "500px", width: "100%", maxWidth: "100%" }}
      />
      <button
        onClick={handleSave}
        className={`mt-6 px-4 py-2 rounded ${
          theme === "dark"
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        style={{ width: "100%", maxWidth: "100%" }}
      >
        Save & Show Output
      </button>
    </div>
  );
}
