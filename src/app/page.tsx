"use client";

import SceneLoader from "@/components/SceneLoader";
import { ThemeProvider, ThemeToggle } from "@/components/scene/SceneThemeContext";
import { ScrollApiProvider, useScrollApi } from "@/components/scene/ScrollApiContext";

function NextButton() {
  const { goToNext } = useScrollApi() ?? {};
  if (!goToNext) return null;
  return (
    <button
      type="button"
      onClick={goToNext}
      className="font-mono rounded border border-foreground/20 bg-background/80 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground"
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 10,
      }}
    >
      Next →
    </button>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <ScrollApiProvider>
        <div className="relative h-screen w-full overflow-hidden bg-background">
          <SceneLoader />
          <ThemeToggle />
          <NextButton />
        </div>
      </ScrollApiProvider>
    </ThemeProvider>
  );
}
