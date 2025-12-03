"use client";
import useSettings from "@/hooks/useSettings";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useState } from "react";
import { ThemeToggleButton, useThemeTransition } from "./ThemeToggleButton";

// Define the props type
interface ThemeToggleProps {
  type: "circle" | "circle-blur" | "polygon" | "gif";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ type }) => {
  const { setTheme } = useTheme();
  const { settings, updateSettings } = useSettings();
  const { startTransition } = useThemeTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = useCallback(() => {
    const newMode: any = settings.mode === "dark" ? "light" : "dark";

    startTransition(() => {
      const updatedSettings = {
        ...settings,
        mode: newMode,
        theme: {
          ...settings.theme,
          styles: {
            light: settings.theme.styles?.light || {},
            dark: settings.theme.styles?.dark || {},
          },
        },
      };
      updateSettings(updatedSettings);
      setTheme(newMode);
    });
  }, [settings, updateSettings, setTheme, startTransition]);

  const currentTheme =
    settings.mode === "system" ? "light" : (settings.mode as "light" | "dark");

  if (!mounted) {
    return null;
  }

  return (
    <div className="">
      {type === "circle" && (
        <ThemeToggleButton
          theme={currentTheme}
          onClick={handleThemeToggle}
          variant="circle"
          start="center"
        />
      )}
      {type === "circle-blur" && (
        <ThemeToggleButton
          theme={currentTheme}
          onClick={handleThemeToggle}
          variant="circle-blur"
          start="top-right"
        />
      )}
      {type === "polygon" && (
        <ThemeToggleButton
          theme={currentTheme}
          onClick={handleThemeToggle}
          variant="polygon"
        />
      )}
      {type === "gif" && (
        <ThemeToggleButton
          theme={currentTheme}
          onClick={handleThemeToggle}
          variant="gif"
          url="https://media.giphy.com/media/KBbr4hHl9DSahKvInO/giphy.gif?cid=790b76112m5eeeydoe7et0cr3j3ekb1erunxozyshuhxx2vl&ep=v1_stickers_search&rid=giphy.gif&ct=s"
        />
      )}
    </div>
  );
};

export default ThemeToggle;
