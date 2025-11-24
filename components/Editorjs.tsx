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

export default function Editorjs() {
  const ejInstance = useRef<EditorJS | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!editorRef.current) return;
    if (ejInstance.current) return;
    ejInstance.current = new EditorJS({
      holder: editorRef.current,
      autofocus: true,
      tools: {
        header: Header,
        list: List,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: "/api/upload-image", // You must implement this endpoint
              byUrl: "/api/fetch-image", // You must implement this endpoint
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
        // You can handle change events here
      },
      // Error handling for Editor.js can be done via try/catch in save or block config
    });
    return () => {
      ejInstance.current?.destroy();
      ejInstance.current = null;
    };
  }, [theme]);

  const handleSave = async () => {
    if (ejInstance.current) {
      const outputData = await ejInstance.current.save();
      alert(JSON.stringify(outputData, null, 2));
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
