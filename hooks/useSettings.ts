import * as React from "react";

export type Mode = "system" | "light" | "dark";

export interface ThemeStyles {
  light?: Record<string, any>;
  dark?: Record<string, any>;
}

export interface UITheme {
  name?: string;
  styles?: ThemeStyles;
}

export interface UISettings {
  mode: Mode;
  theme: UITheme;
}

const LOCAL_STORAGE_KEY = "ui-settings";

const DEFAULT_SETTINGS: UISettings = {
  mode: "system",
  theme: {
    name: "default",
    styles: {
      light: {},
      dark: {},
    },
  },
};

function readSettingsFromStorage(): UISettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<UISettings> | null;
    return {
      ...DEFAULT_SETTINGS,
      ...(parsed || {}),
      theme: {
        ...DEFAULT_SETTINGS.theme,
        ...(parsed?.theme || {}),
        styles: {
          ...DEFAULT_SETTINGS.theme.styles,
          ...(parsed?.theme?.styles || {}),
        },
      },
    };
  } catch (error) {
    console.error("Failed to read settings from localStorage", error);
    return DEFAULT_SETTINGS;
  }
}

function writeSettingsToStorage(settings: UISettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    // Broadcast an event so other tabs/components listening to `storage` can react
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: LOCAL_STORAGE_KEY,
        newValue: JSON.stringify(settings),
      } as StorageEventInit)
    );
  } catch (error) {
    console.error("Failed to write settings to localStorage", error);
  }
}

/**
 * useSettings hooks keeps a copy of UI settings (theme/mode)
 * - Loads initial settings from localStorage (if available)
 * - Persists any updates to localStorage
 * - Returns `settings` and `updateSettings`
 */
export function useSettings() {
  const [settings, setSettings] = React.useState<UISettings>(() =>
    readSettingsFromStorage()
  );

  // Keep settings in localStorage when it changes
  React.useEffect(() => {
    writeSettingsToStorage(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  // Listen for `storage` events (cross-tab sync)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: StorageEvent) => {
      if (e.key !== LOCAL_STORAGE_KEY) return;
      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : null;
        if (parsed) setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (err) {
        // ignore parse errors
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const updateSettings = React.useCallback(
    (next: Partial<UISettings> | ((prev: UISettings) => UISettings)) => {
      setSettings((prev) => {
        const updated =
          typeof next === "function" ? next(prev) : { ...prev, ...next };
        // Deep merge theme.styles to prevent losing nested style objects
        updated.theme = {
          ...prev.theme,
          ...updated.theme,
          styles: {
            ...prev.theme.styles,
            ...(updated.theme?.styles || {}),
          },
        };
        writeSettingsToStorage(updated);
        return updated;
      });
    },
    []
  );

  return { settings, updateSettings } as const;
}

export default useSettings;
