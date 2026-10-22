import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Console | Jash Garach",
  description: "Content Management Console for Jash Garach Portfolio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased font-sans">
      {children}
    </div>
  );
}
