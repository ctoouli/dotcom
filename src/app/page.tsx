"use client";

import { projects } from "@/content/projects";
import SceneLoader from "@/components/SceneLoader";
import { ThemeProvider, ThemeToggle } from "@/components/scene/SceneThemeContext";

export default function Home() {
  return (
    <ThemeProvider>
      <div className="relative h-screen w-full overflow-hidden bg-background">
        <a
        href="#projects-list"
        className="absolute left-4 top-4 z-10 rounded border border-foreground/20 bg-background/80 px-3 py-2 text-sm text-foreground opacity-90 backdrop-blur-sm transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-foreground"
      >
        Skip to projects list
      </a>
      <SceneLoader />
      <section
        id="projects-list"
        tabIndex={-1}
        className="projects-list-accessibility sr-only focus-within:static focus-within:z-20 focus-within:size-auto focus-within:m-0 focus-within:max-h-[80vh] focus-within:overflow-auto focus-within:bg-background/90 focus-within:p-6 focus-within:clip-auto focus-within:whitespace-normal focus-within:text-foreground"
        aria-label="Projects list (accessibility)"
      >
        <ul className="space-y-2">
          {projects.map((p) => (
            <li key={p.id}>
              <a href={p.href ?? "#"} className="text-foreground underline">
                {p.title}
              </a>
              {p.description ? (
                <span className="text-foreground/60"> — {p.description}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}
