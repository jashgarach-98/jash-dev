import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import HireMeChatbot from "@/components/hire-me/HireMeChatbot";
import { HireMeProvider } from "@/context/HireMeContext";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <HireMeProvider>
      <CustomCursor />
      <Navbar />
      <main id="main" className="pt-16 md:pt-20">
        {children}
      </main>
      <HireMeChatbot />
    </HireMeProvider>
  );
}
