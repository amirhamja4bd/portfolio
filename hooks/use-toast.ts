import { toast as sonnerToast } from "sonner";

type ToastPayload =
  | string
  | {
      title: string;
      description?: string;
      variant?: "default" | "destructive";
    };

/**
 * Standalone toast function. Accepts a string or an object with title/description/variant.
 */
export function toast(payload: ToastPayload) {
  if (typeof payload === "string") {
    return sonnerToast(payload);
  }

  const { title, description, variant } = payload;

  if (variant === "destructive") {
    return sonnerToast.error(title, { description });
  }

  return sonnerToast.success(title, { description });
}

/**
 * Hook-based version (keeps existing pattern: const { toast } = useToast())
 */
export function useToast() {
  return { toast };
}
