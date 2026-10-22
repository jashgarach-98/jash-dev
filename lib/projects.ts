export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  kind: string;
  title: string;
  description: string;
  tags: string[];
  color: string;
  links: ProjectLink[];
  wide?: boolean;
}

import rawProjects from "@/data/projects.json";

export const projects: Project[] = rawProjects as Project[];

export function getAllProjects(): Project[] {
  return [...projects];
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
