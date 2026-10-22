import AdminDashboard from "@/components/admin/AdminDashboard";
import rawPosts from "@/data/posts.json";
import rawProjects from "@/data/projects.json";
import type { Post } from "@/lib/posts";
import type { Project } from "@/lib/projects";

export default function AdminPage() {
  const posts = rawPosts as Post[];
  const projects = rawProjects as Project[];

  return <AdminDashboard initialPosts={posts} initialProjects={projects} />;
}
