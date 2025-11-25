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

            // Fire async delete requests for removed images only on the client
            if (typeof window !== "undefined" && removed.length) {
              removed.forEach(async (src) => {
                if (!src || typeof src !== "string") return;
                // Only delete images that were uploaded to our /uploads/* path
                if (!src.includes("/uploads/")) return;
                try {
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
                }
              });
            }

            return next;
          } catch (err) {
            console.error("ImageDeletePlugin apply error:", err);
            return value;
          }
        },
      },
    });

    return [plugin];
  },
});

export default ImageDeletePlugin;
