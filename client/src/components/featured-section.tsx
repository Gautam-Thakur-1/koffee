import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const productFeatures = [
  {
    image: "src/assets/comments.png",
    title: "Collaboration",
    description: "Collaborate seamlessly within the document.",
  },
  {
    image: "src/assets/text-editor.png",
    title: "Text Editor",
    description: "All collaborative features embedded in a text editor.",
  },
  {
    image: "src/assets/realtime-apis.png",
    title: "Real-Time",
    description: "Instant visibility of changes as they happen.",
  },
  {
    image: "src/assets/dashboard.png",
    title: "Lighting Fast",
    description: "Experience unmatched speed and responsiveness.",
  },
  {
    image: "src/assets/infrastructure.png",
    title: "Infrastructure",
    description: "Powered by MERN stack for scalability and reliability.",
  },
];

const FeaturedSection = () => {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 1000], [0.85, 0.95]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const card = containerRef.current;
    const width = card.offsetWidth;
    const height = card.offsetHeight;

    // Create canvas for the beam effect
    const canvas = document.createElement("canvas");
    canvas.className = "absolute top-0 left-0 pointer-events-none";
    canvas.width = width;
    canvas.height = height;
    card.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let startTime = performance.now();

    const drawBeam = (time: number) => {
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      const duration = 10000;
      const progress = ((time - startTime) % duration) / duration;
      const totalLength = 2 * (width + height);
      const beamLength = 300;

      let distance = progress * totalLength;
      let x, y;
      let angle = 0;

      // Calculate position along the perimeter
      if (distance < width) {
        x = distance;
        y = 0;
        angle = 0;
      } else if (distance < width + height) {
        x = width;
        y = distance - width;
        angle = Math.PI / 2;
      } else if (distance < 2 * width + height) {
        x = width - (distance - (width + height));
        y = height;
        angle = Math.PI;
      } else {
        x = 0;
        y = height - (distance - (2 * width + height));
        angle = (3 * Math.PI) / 2;
      }

      // Draw the glowing beam
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Create gradient with your theme colors
      const gradient = ctx.createLinearGradient(0, 0, beamLength, 0);
      gradient.addColorStop(0, "rgba(168, 85, 247, 0)");
      gradient.addColorStop(0.3, "rgba(192, 132, 252, 1)"); // Lighter purple
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.9)"); // White core
      gradient.addColorStop(0.7, "rgba(192, 132, 252, 1)"); // Lighter purple
      gradient.addColorStop(1, "rgba(168, 85, 247, 0)");

      ctx.fillStyle = gradient;
      ctx.shadowColor = "#A855F7"; // Purple glow
      ctx.shadowBlur = 15;
      ctx.fillRect(0, -1.5, beamLength, 3);

      ctx.restore();

      requestAnimationFrame(drawBeam);
    };

    const animationFrame = requestAnimationFrame(drawBeam);

    return () => {
      cancelAnimationFrame(animationFrame);
      if (card.contains(canvas)) {
        card.removeChild(canvas);
      }
    };
  }, []);

  return (
    <motion.div
      className="w-full min-h-screen p-4 flex flex-col items-center justify-center h-full bg-black rounded-3xl text-neutral-200"
      id="features"
      style={{ scale }}
    >
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full filter blur-[128px] opacity-20" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full filter blur-[128px] opacity-20" />
      <h1 className="text-neutral-500">More Than Just Text Editor</h1>

      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-center my-4">
        Fully Integrated <br /> Collaborative Platform
      </h1>

      <p className="my-4 md:text-xl w-1/2 lg:w-1/3 text-center">
        Work together seamlessly with our real-time document editor. Edit
        documents simultaneously, see changes instantly, and chat directly
        within the document.
      </p>

      <div
        className="relative grid my-4 grid-cols-1 md:grid-cols-3 rounded w-full lg:max-w-7xl border-[0.5px] border-neutral-700 overflow-hidden"
        ref={containerRef}
      >
        {productFeatures.map((feature, index) => (
          <div
            key={index}
            className="p-8 border-[0.5px] border-neutral-700 relative z-10"
          >
            <img src={feature.image} alt={feature.title} className="h-20" />
            <h1 className="text-lg font-bold mt-4">{feature.title}</h1>
            <p className="text-neutral-400 w-3/4">{feature.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturedSection;
