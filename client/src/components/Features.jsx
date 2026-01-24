import FeatureCard from "./FeatureCard";
import { MdDescription, MdTrackChanges } from "react-icons/md";
import { IoChatbubblesOutline } from "react-icons/io5";
import { HiOutlineChartBar } from "react-icons/hi2";

function Features() {
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
    <section className="py-5 px-5">
      <div className="group/container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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
