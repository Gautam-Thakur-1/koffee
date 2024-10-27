import Lenis from "lenis";
import FeaturedSection from "../components/featured-section";
import HeroSection from "../components/hero-section";
import MainNavbar from "../components/navigation/main-navbar";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis();

    // Listen for the scroll event and log the event data
    lenis.on("scroll", (e) => {
      console.log(e);
    });

    // Use requestAnimationFrame to continuously update the scroll
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });

  return (
    <>
      <MainNavbar />
      <HeroSection />
      <FeaturedSection />
    </>
  );
}

export default App;
