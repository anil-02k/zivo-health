
import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  // Add scroll reveal animations
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-fade-in');
      
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.9;
        
        if (isVisible) {
          element.classList.add('opacity-100');
        }
      });
    };

    // Initial check
    handleScroll();
    
    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
