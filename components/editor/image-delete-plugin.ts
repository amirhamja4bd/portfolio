import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { toast } from "sonner";

function getImageSrcs(doc: any) {
  const srcs: string[] = [];
  doc.descendants((node: any) => {
    if (node.type.name === "image" && node.attrs?.src) {
      srcs.push(node.attrs.src);
    }
    return true;
  });
  return srcs;
}

const PLUGIN_KEY = new PluginKey("image-delete-plugin");

export const ImageDeletePlugin = Extension.create({
  name: "image-delete-plugin",
  addProseMirrorPlugins() {
    const pendingDeletes = new Map<string, any>();
    let editorView: any = null;

    const plugin = new Plugin({
      key: PLUGIN_KEY,
      state: {
        init: (_config, state) => new Set(getImageSrcs(state.doc)),
        apply(tr, value: Set<string>, _oldState, newState) {
          try {
            const prevSet = new Set(value);
            const current = new Set(getImageSrcs(newState.doc));
            // Compute removed images
            const removed = Array.from(prevSet).filter((s) => !current.has(s));

            // Update state
            const next = current;
            if (typeof window !== "undefined" && removed.length) {
              const added = Array.from(current).filter((s) => !value.has(s));

              removed.forEach((src) => {
                if (!src || typeof src !== "string") return;
                if (!src.includes("/uploads/")) return;

                if (added.length) return;

                if (pendingDeletes.has(src)) return;

                const timer = setTimeout(async () => {
                  try {
                    const srcsNow = editorView
                      ? getImageSrcs(editorView.state.doc)
                      : [];
                    if (srcsNow.includes(src)) {
                      pendingDeletes.delete(src);
                      return;
                    }

                    await fetch("/api/upload", {
                      method: "DELETE",
                      credentials: "include",
                      headers: {
                        "content-type": "application/json",
                      },
                      body: JSON.stringify({ url: src }),
                    });
                  } catch (err: any) {
                    console.error("Failed to delete image:", err);
                    toast.error("Failed to delete image on the server.");
                  } finally {
                    pendingDeletes.delete(src);
                  }
                }, 2000);

                pendingDeletes.set(src, timer);
              });
            }

            // Clear any pending deletions if images were re-added
            Array.from(pendingDeletes.keys()).forEach((pendingSrc) => {
              if (current.has(pendingSrc)) {
                const t = pendingDeletes.get(pendingSrc);
                if (t) clearTimeout(t);
                pendingDeletes.delete(pendingSrc);
              }
            });

            return next;
          } catch (err) {
            console.error("ImageDeletePlugin apply error:", err);
            return value;
          }
        },
      },
      view: (view) => {
        editorView = view;
        return {
          update: () => {},
          destroy: () => {
            // Clean up scheduled timers
            pendingDeletes.forEach((t) => clearTimeout(t));
            pendingDeletes.clear();
          },
        };
      },
    });

    return [plugin];
  },
});

export default ImageDeletePlugin;
