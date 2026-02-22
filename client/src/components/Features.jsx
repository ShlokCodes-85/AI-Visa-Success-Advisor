import { useState } from 'react';
import { motion } from 'framer-motion';
import FeatureCard from "./FeatureCard";
import { MdDescription, MdTrackChanges } from "react-icons/md";
import { IoChatbubblesOutline } from "react-icons/io5";
import { HiOutlineChartBar } from "react-icons/hi2";

function Features() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const features = [
    {
      title: "Comprehensive Form Guidance",
      description:
        "Step-by-step assistance to complete all visa application forms accurately.",
      icon: <MdDescription />
    },
    {
      title: "AI-Powered Mock Interviews",
      description:
        "Practice with realistic AI interviews and get instant feedback on your responses.",
      icon: <IoChatbubblesOutline />
    },
    {
      title: "Personalized Assessment & Tips",
      description:
        "Receive an approval likelihood score and tailored advice for improvement.",
      icon: <HiOutlineChartBar />
    },
    {
      title: "Track Your Progress",
      description:
        "Monitor your application journey and readiness with clear progress indicators.",
      icon: <MdTrackChanges />
    }
  ];

  return (
    <section id="features" className="py-8 sm:py-10 lg:py-12 pb-8 sm:pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto text-center mb-6 sm:mb-8 lg:mb-10">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white px-2 sm:px-0">
          Key Features Designed For Your Success
        </h2>
      </div>

      <motion.div 
        className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={cardVariants}>
            <FeatureCard
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              isHovered={hoveredIndex === index}
              isDimmed={hoveredIndex !== null && hoveredIndex !== index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          </motion.div>
        ))}
      </motion.div>

    </section>
  );
}

export default Features;
