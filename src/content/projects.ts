export interface Project {
  id: string;
  title: string;
  description?: string;
  href?: string;
}

export const projects: Project[] = [
  { id: "1", title: "Project One", description: "First portfolio piece.", href: "#" },
  { id: "2", title: "Project Two", description: "Second portfolio piece.", href: "#" },
  { id: "3", title: "Project Three", description: "Third portfolio piece.", href: "#" },
  { id: "4", title: "Project Four", description: "Fourth portfolio piece.", href: "#" },
  { id: "5", title: "Project Five", description: "Fifth portfolio piece.", href: "#" },
];
