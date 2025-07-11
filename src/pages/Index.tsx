import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
// import BlogsSection from "@/components/BlogsSection";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WaveSeparator from "@/components/WaveSeparator";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        // The overall page background is now set by `bg-background` and text by `text-foreground`
        className="min-h-screen bg-background text-foreground relative no-x-overflow"
      >
        <Navbar />
        <main className="pt-[120px]">
          {/* Hero Section: Using primary and secondary for a deep blue gradient */}
          {/* from-primary is #3D52A0, via-secondary/30 is #7091E6 with 30% opacity */}
          <div className="bg-gradient-to-br from-primary via-secondary/30 to-primary">
            <Hero />
          </div>

          {/* Wave Separator: Using semantic variants defined in index.css */}
          <WaveSeparator variant="primary" />

          {/* About Section: Background and a subtle accent */}
          {/* from-background is #EDE8F5, to-accent/20 is #ADBBDA with 20% opacity */}
          <div className="bg-gradient-to-br from-background to-accent/20">
            <About />
          </div>

          <WaveSeparator variant="secondary" flip />

          {/* Experience Section: Secondary and background */}
          {/* from-secondary/10 is #7091E6 with 10% opacity, via-background is #EDE8F5, to-primary/10 is #3D52A0 with 10% opacity */}
          <div className="bg-gradient-to-br from-secondary/10 via-background to-primary/10">
            <Experience />
          </div>

          <WaveSeparator variant="primary" />

          {/* Projects Section: Background and muted */}
          {/* from-background is #EDE8F5, to-muted/10 is #8697C4 with 10% opacity */}
          <div className="bg-gradient-to-br from-background to-muted/10">
            <Projects />
          </div>

          <WaveSeparator variant="accent" flip />

          {/* Skills Section: Background and primary */}
          {/* from-background is #EDE8F5, to-primary/10 is #3D52A0 with 10% opacity */}
          <div className="bg-gradient-to-br from-background to-primary/10">
            <Skills />
          </div>

          <WaveSeparator variant="muted" />

          {/* Certifications Section: Muted and background */}
          {/* from-muted/10 is #8697C4 with 10% opacity, via-background is #EDE8F5, to-accent/10 is #ADBBDA with 10% opacity */}
          <div className="bg-gradient-to-br from-muted/10 via-background to-accent/10">
            <Certifications />
          </div>

          {/* <WaveSeparator variant="secondary" flip />

          <div className="bg-gradient-to-br from-blue-900/10 via-background to-purple-900/10">
            <BlogsSection />
          </div> */}

          <WaveSeparator variant="accent" flip />


          <div className="bg-gradient-to-br from-background to-accent/20">
            <Contact />
          </div>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
