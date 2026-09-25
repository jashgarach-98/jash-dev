import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import HireMeChatbot from "@/components/hire-me/HireMeChatbot";
import { HireMeProvider } from "@/context/HireMeContext";

export default function Home() {
  return (
    <HireMeProvider>
      <CustomCursor />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <HireMeChatbot />
    </HireMeProvider>
  );
}
