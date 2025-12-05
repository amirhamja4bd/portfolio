"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  useSettings,
  type FontFamily,
  type ThemeColor,
} from "@/contexts/settings-context";
import { cn } from "@/lib/utils";
import { Moon, Palette, Settings, Sun, Type } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const colorSchemes: { value: ThemeColor; label: string; color: string }[] = [
  { value: "default", label: "Default", color: "bg-zinc-900 dark:bg-zinc-100" },
  { value: "emerald", label: "Emerald", color: "bg-emerald-500" },
  { value: "sky", label: "Sky Blue", color: "bg-sky-500" },
  { value: "violet", label: "Violet", color: "bg-violet-500" },
  { value: "rose", label: "Rose", color: "bg-rose-500" },
  { value: "amber", label: "Amber", color: "bg-amber-500" },
];

const fonts: { value: FontFamily; label: string; preview: string }[] = [
  { value: "cairo", label: "Cairo", preview: "Arabic & Modern" },
  {
    value: "inter",
    label: "Inter",
    preview: "Clean & modern interface design",
  },
  {
    value: "poppins",
    label: "Poppins",
    preview: "Friendly rounded typography",
  },
  { value: "roboto", label: "Roboto", preview: "Professional & clear reading" },
  {
    value: "montserrat",
    label: "Montserrat",
    preview: "Bold contemporary headlines",
  },
  {
    value: "playfair",
    label: "Playfair Display",
    preview: "Elegant serif for luxury",
  },
  { value: "lora", label: "Lora", preview: "Classic readable paragraphs" },
  { value: "raleway", label: "Raleway", preview: "Sophisticated thin letters" },
  {
    value: "source-sans",
    label: "Source Sans 3",
    preview: "Technical clean interface",
  },
  {
    value: "work-sans",
    label: "Work Sans",
    preview: "Balanced versatile design",
  },
  { value: "dm-sans", label: "DM Sans", preview: "Geometric modern style" },
];

const fontFamilyMap: Record<FontFamily, string> = {
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

export function SettingsDrawer() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { themeColor, fontFamily, setThemeColor, setFontFamily } =
    useSettings();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Open settings</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="fixed bottom-0 right-0 left-auto mt-0 h-screen w-full max-w-md rounded-none">
        <div className="mx-auto w-full h-full flex flex-col">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-2xl font-bold">Customize</DrawerTitle>
            <DrawerDescription>
              Personalize your portfolio experience with custom themes, colors,
              and fonts.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 space-y-8">
            {/* Theme Toggle */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <Label className="text-base font-semibold">Theme Mode</Label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setTheme("system")}
                >
                  System
                </Button>
              </div>
            </div>

            <Separator />

            {/* Color Scheme */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <Label className="text-base font-semibold">Color Scheme</Label>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.value}
                    onClick={() => {
                      console.log("🎨 Color clicked:", scheme.value);
                      setThemeColor(scheme.value);
                    }}
                    className={cn(
                      "group relative flex flex-col items-center gap-2 rounded-lg p-3 hover:bg-accent transition-colors",
                      themeColor === scheme.value && "bg-accent"
                    )}
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full border-2 transition-all",
                        scheme.color,
                        themeColor === scheme.value
                          ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                          : "border-border group-hover:scale-105"
                      )}
                    />
                    <span className="text-xs font-medium text-center line-clamp-1">
                      {scheme.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Font Family */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <Label className="text-base font-semibold">Font Family</Label>
              </div>
              <div className="space-y-2">
                {fonts.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => {
                      console.log("🔤 Font clicked:", font.value);
                      setFontFamily(font.value);
                    }}
                    className={cn(
                      "w-full text-left rounded-lg border-2 p-4 transition-all hover:border-primary/50 hover:bg-accent",
                      fontFamily === font.value
                        ? "border-primary bg-accent shadow-sm"
                        : "border-border"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-semibold">{font.label}</div>
                        <div
                          className="text-sm text-muted-foreground"
                          style={{ fontFamily: fontFamilyMap[font.value] }}
                        >
                          {font.preview}
                        </div>
                      </div>
                      {fontFamily === font.value && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DrawerFooter className="border-t">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
