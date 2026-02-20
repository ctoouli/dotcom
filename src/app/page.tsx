import { projects } from "@/content/projects";
import SceneLoader from "@/components/SceneLoader";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F0F0EB]">
      <a
        href="#projects-list"
        className="absolute left-4 top-4 z-10 rounded border border-[#0F0F0F]/20 bg-white/50 px-3 py-2 text-sm text-[#0F0F0F] opacity-90 backdrop-blur-sm transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#0F0F0F]"
      >
        Skip to projects list
      </a>
      <SceneLoader />
      <section
        id="projects-list"
        tabIndex={-1}
        className="projects-list-accessibility sr-only focus-within:static focus-within:z-20 focus-within:size-auto focus-within:m-0 focus-within:max-h-[80vh] focus-within:overflow-auto focus-within:bg-white/90 focus-within:p-6 focus-within:clip-auto focus-within:whitespace-normal focus-within:text-[#0F0F0F]"
        aria-label="Projects list (accessibility)"
      >
        <ul className="space-y-2">
          {projects.map((p) => (
            <li key={p.id}>
              <a href={p.href ?? "#"} className="text-[#0F0F0F] underline">
                {p.title}
              </a>
              {p.description ? (
                <span className="text-[#0F0F0F]/60"> — {p.description}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
