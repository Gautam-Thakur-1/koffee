import { motion, useScroll, useTransform } from "framer-motion";

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

  return (
    <motion.div
      className="w-full min-h-screen p-4 flex flex-col items-center justify-center h-full bg-black rounded-3xl text-neutral-200"
      id="features"
      style={{ scale }}
    >
      <h1 className="text-neutral-500">More Than Just Text Editor</h1>

      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-center my-4">
        Fully Integrated <br /> Collaborative Platform
      </h1>

      <p className="my-4 md:text-xl w-1/2 lg:w-1/3 text-center">
        Work together seamlessly with our real-time document editor. Edit
        documents simultaneously, see changes instantly, and chat directly
        within the document.
      </p>

      {/* grid box */}
      <div
        className="grid my-4
      grid-cols-1 md:grid-cols-3  rounded w-full lg:max-w-7xl border border-neutral-700"
      >
        {productFeatures.map((feature, index) => (
          <div key={index} className="p-8 border border-neutral-700">
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
