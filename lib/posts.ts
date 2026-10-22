export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "code"; language: string; code: string }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    };

export interface PostReference {
  label: string;
  href: string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  coverImage?: {
    src: string;
    alt: string;
    caption?: string;
  };
  /** ISO date used for sorting and metadata. */
  date: string;
  /** Human-friendly date shown on the page. */
  publishedLabel: string;
  readingTime: string;
  category: string;
  tags: string[];
  /** Accent hex color used for the card and article flourishes. */
  accent: string;
  blocks: PostBlock[];
  references?: PostReference[];
}

import rawPosts from "@/data/posts.json";

export const posts: Post[] = rawPosts as Post[];

export function getAllPosts(): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getAssetPath(path: string): string {
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? (process.env.GITHUB_ACTIONS === "true" ? "/jash-dev" : "");
  return path.startsWith("/") ? `${prefix}${path}` : `${prefix}/${path}`;
}

