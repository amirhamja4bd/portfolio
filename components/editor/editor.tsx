"use client";

import { useState } from "react";

import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  type JSONContent,
} from "novel";

// Import highlight.js CSS theme
import "highlight.js/styles/github-dark.css";

// Use novel-provided extensions/plugins for better behavior
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { handleImageDrop, handleImagePaste } from "novel/plugins";

import EditorMenu from "@/components/editor/editor-menu";
import { defaultExtensions } from "@/components/editor/extensions";
import { uploadFn } from "@/components/editor/image-upload";
import { ColorSelector } from "@/components/editor/selectors/color-selector";
import { LinkSelector } from "@/components/editor/selectors/link-selector";
import { MathSelector } from "@/components/editor/selectors/math-selector";
import { NodeSelector } from "@/components/editor/selectors/node-selector";
import { TextButtons } from "@/components/editor/selectors/text-buttons";
import {
  slashCommand,
  suggestionItems,
} from "@/components/editor/slash-command";

import { Separator } from "@/components/ui/separator";

const hljs = require("highlight.js");

const extensions = [...defaultExtensions, slashCommand] as any;

export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

interface EditorProps {
  initialValue?: JSONContent;
  onChange: (content: string) => void;
}

export default function Editor({ initialValue, onChange }: EditorProps) {
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  return (
    <div className="relative w-full max-w-screen">
      <EditorRoot>
        <EditorContent
          initialContent={initialValue}
          extensions={extensions}
          className="min-h-96 rounded-xl border p-4 dark:bg-input/10 [&_.is-editor-empty:before]:text-muted-foreground [&_.is-editor-empty:before]:float-left [&_.is-editor-empty:before]:h-0 [&_.is-editor-empty:before]:pointer-events-none [&_.is-editor-empty:before]:content-[attr(data-placeholder)] [&_.is-empty:before]:text-muted-foreground [&_.is-empty:before]:float-left [&_.is-empty:before]:h-0 [&_.is-empty:before]:pointer-events-none [&_.is-empty:before]:content-[attr(data-placeholder)]"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }) => {
            const html = editor.getHTML();
            const highlightedHtml = highlightCodeblocks(html);
            onChange(highlightedHtml);

            // If the document ends with an image, insert a trailing paragraph so users can type below the image.
            try {
              const { doc } = editor.state;
              const last = doc.lastChild;
              if (last?.type?.name === "image") {
                const docSize = doc.content.size;
                // Only insert paragraph when doc actually ends with image (prevents duplication)
                // `insertContentAt` with a paragraph will add a new node at the end.
                editor
                  .chain()
                  .focus()
                  .insertContentAt(docSize, [{ type: "paragraph" }])
                  .run();
                // Place the cursor inside the new paragraph
                editor
                  .chain()
                  .focus()
                  .setTextSelection(docSize + 1)
                  .run();
              }
            } catch (err) {
              // ignore any errors, but log for debugging
              console.debug("Could not ensure trailing paragraph", err);
            }
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item: any) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorMenu open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />

            <Separator orientation="vertical" />
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />

            <Separator orientation="vertical" />
            <MathSelector />

            <Separator orientation="vertical" />
            <TextButtons />

            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorMenu>
        </EditorContent>
      </EditorRoot>
    </div>
  );
}
