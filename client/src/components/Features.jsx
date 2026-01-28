import FeatureCard from "./FeatureCard";
import { MdDescription, MdTrackChanges } from "react-icons/md";
import { IoChatbubblesOutline } from "react-icons/io5";
import { HiOutlineChartBar } from "react-icons/hi2";
import useLazyLoad from '../hooks/useLazyLoad';

function Features() {
  const { elementRef, isVisible } = useLazyLoad();
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
    <section ref={elementRef} id="features" className="py-12 px-5" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease-in' }}>
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Key Features Designed For Your Success
        </h2>
      </div>

      <div className="group/container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>

    </section>
  );
}

export default Features;
