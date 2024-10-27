import { ArrowRight } from "lucide-react";
import NeonCircle from "./neon-circle";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="w-full h-full">
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <NeonCircle delay={0} />
        <NeonCircle delay={5} />
        <NeonCircle delay={10} />
      </div>

      <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Collaborate in Real-Time
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
              Edit documents together, see changes instantly, and bring your
              ideas to life with <span className="font-bold">Koffee</span>.
            </p>
            <div className="space-x-4">
              <Link to={"/register"}>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to={"/#features"}>
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;
