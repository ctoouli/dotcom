import { projects } from "@/content/projects";
import SceneLoader from "@/components/SceneLoader";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      <a
        href="#projects-list"
        className="absolute left-4 top-4 z-10 rounded bg-zinc-800 px-3 py-2 text-sm text-zinc-200 opacity-90 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-400"
      >
        Skip to projects list
      </a>
      <SceneLoader />
      <section
        id="projects-list"
        tabIndex={-1}
        className="projects-list-accessibility sr-only focus-within:static focus-within:z-20 focus-within:size-auto focus-within:m-0 focus-within:max-h-[80vh] focus-within:overflow-auto focus-within:bg-zinc-900 focus-within:p-6 focus-within:clip-auto focus-within:whitespace-normal"
        aria-label="Projects list (accessibility)"
      >
        <ul className="space-y-2">
          {projects.map((p) => (
            <li key={p.id}>
              <a href={p.href ?? "#"} className="text-zinc-200 underline">
                {p.title}
              </a>
              {p.description ? (
                <span className="text-zinc-400"> — {p.description}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
