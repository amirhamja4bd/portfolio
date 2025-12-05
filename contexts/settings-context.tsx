"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ThemeColor =
  | "default"
  | "emerald"
  | "sky"
  | "violet"
  | "rose"
  | "amber";

export type FontFamily =
  | "cairo"
  | "inter"
  | "poppins"
  | "roboto"
  | "montserrat"
  | "playfair"
  | "lora"
  | "raleway"
  | "source-sans"
  | "work-sans"
  | "dm-sans";

interface SettingsContextType {
  themeColor: ThemeColor;
  fontFamily: FontFamily;
  setThemeColor: (color: ThemeColor) => void;
  setFontFamily: (font: FontFamily) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const themeColorValues: Record<
  Exclude<ThemeColor, "default">,
  {
    light: {
      primary: string;
      primaryForeground: string;
      brandColor: string;
    };
    dark: { primary: string; primaryForeground: string; brandColor: string };
  }
> = {
  // Brand Accent - Emerald/Teal (#5EE9B5 - your exact brand color)
  emerald: {
    light: {
      primary: "oklch(0.78 0.16 158)",
      primaryForeground: "oklch(0.99 0 0)",
      brandColor: "oklch(85.8% 0.194 163.8)",
    },
    dark: {
      primary: "oklch(85.8% 0.194 163.8)",
      primaryForeground: "oklch(0.15 0 0)",
      brandColor: "oklch(85.8% 0.194 163.8)",
    },
  },
  // Sky Blue - Calm and refreshing
  sky: {
    light: {
      primary: "oklch(0.65 0.15 235)",
      primaryForeground: "oklch(0.99 0 0)",
      brandColor: "oklch(0.55 0.2 220)",
    },
    dark: {
      primary: "oklch(0.75 0.13 235)",
      primaryForeground: "oklch(0.15 0 0)",
      brandColor: "oklch(0.55 0.2 220)",
    },
  },
  // Violet - Modern and elegant
  violet: {
    light: {
      primary: "oklch(0.6 0.22 295)",
      primaryForeground: "oklch(0.99 0 0)",
      brandColor: "oklch(0.65 0.25 295)",
    },
    dark: {
      primary: "oklch(0.72 0.2 295)",
      primaryForeground: "oklch(0.15 0 0)",
      brandColor: "oklch(0.75 0.22 295)",
    },
  },
  // Rose - Soft and warm
  rose: {
    light: {
      primary: "oklch(0.65 0.2 10)",
      primaryForeground: "oklch(0.99 0 0)",
      brandColor: "oklch(0.7 0.22 10)",
    },
    dark: {
      primary: "oklch(0.75 0.18 10)",
      primaryForeground: "oklch(0.15 0 0)",
      brandColor: "oklch(0.8 0.2 10)",
    },
  },
  // Amber - Warm and inviting
  amber: {
    light: {
      primary: "oklch(0.7 0.17 75)",
      primaryForeground: "oklch(0.2 0 0)",
      brandColor: "oklch(0.75 0.19 75)",
    },
    dark: {
      primary: "oklch(0.8 0.15 75)",
      primaryForeground: "oklch(0.15 0 0)",
      brandColor: "oklch(0.85 0.17 75)",
    },
  },
};

const fontFamilyValues: Record<FontFamily, string> = {
  cairo: "'Cairo', sans-serif",
  inter: "'Inter', sans-serif",
  poppins: "'Poppins', sans-serif",
  roboto: "'Roboto', sans-serif",
  montserrat: "'Montserrat', sans-serif",
  playfair: "'Playfair Display', serif",
  lora: "'Lora', serif",
  raleway: "'Raleway', sans-serif",
  "source-sans": "'Source Sans 3', sans-serif",
  "work-sans": "'Work Sans', sans-serif",
  "dm-sans": "'DM Sans', sans-serif",
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColorState] = useState<ThemeColor>("default");
  const [fontFamily, setFontFamilyState] = useState<FontFamily>("inter");
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage on mount (only once)
  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const savedColor = localStorage.getItem("themeColor") as ThemeColor;
      const savedFont = localStorage.getItem("fontFamily") as FontFamily;

      // Set color if saved (default is also valid)
      if (
        savedColor &&
        (savedColor === "default" ||
          themeColorValues[savedColor as Exclude<ThemeColor, "default">])
      ) {
        setThemeColorState(savedColor);
      }
      if (savedFont && fontFamilyValues[savedFont]) {
        setFontFamilyState(savedFont);
      }
    }
  }, []); // Empty dependency array - runs only once on mount

  // Apply theme color changes (only after mounted)
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    // If default is selected, remove custom colors to use global.css defaults
    if (themeColor === "default") {
      const root = document.documentElement;
      root.style.removeProperty("--primary");
      root.style.removeProperty("--primary-foreground");
      root.style.removeProperty("--brandColor");

      // Remove dark mode style if it exists
      const darkModeStyle = document.getElementById("dynamic-dark-mode-colors");
      if (darkModeStyle) {
        darkModeStyle.remove();
      }

      console.log("✅ Using default colors from global.css");
      return;
    }

    // Only apply custom colors for non-default selections
    const root = document.documentElement;
    const colors =
      themeColorValues[themeColor as Exclude<ThemeColor, "default">];

    // Apply light mode colors to :root
    root.style.setProperty("--primary", colors.light.primary);
    root.style.setProperty(
      "--primary-foreground",
      colors.light.primaryForeground
    );
    root.style.setProperty("--brandColor", colors.light.brandColor);

    // Create a style element for dark mode if it doesn't exist
    let darkModeStyle = document.getElementById("dynamic-dark-mode-colors");
    if (!darkModeStyle) {
      darkModeStyle = document.createElement("style");
      darkModeStyle.id = "dynamic-dark-mode-colors";
      document.head.appendChild(darkModeStyle);
    }

    // Apply dark mode colors via CSS
    darkModeStyle.textContent = `
      .dark {
        --primary: ${colors.dark.primary};
        --primary-foreground: ${colors.dark.primaryForeground};
        --brandColor: ${colors.dark.brandColor};
      }
    `;

    console.log("✅ Custom theme color applied:", themeColor, colors);
  }, [themeColor, mounted]);

  // Apply font family changes (only after mounted)
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const root = document.documentElement;
    const fontValue = fontFamilyValues[fontFamily];
    root.style.setProperty("--font-family", fontValue);

    // Also apply directly to body for immediate effect
    document.body.style.fontFamily = fontValue;

    console.log("✅ Font family applied:", fontFamily, fontValue);
  }, [fontFamily, mounted]);

  const setThemeColor = useCallback((color: ThemeColor) => {
    setThemeColorState(color);
    if (typeof window !== "undefined") {
      localStorage.setItem("themeColor", color);
    }
  }, []);

  const setFontFamily = useCallback((font: FontFamily) => {
    setFontFamilyState(font);
    if (typeof window !== "undefined") {
      localStorage.setItem("fontFamily", font);
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{ themeColor, fontFamily, setThemeColor, setFontFamily }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
