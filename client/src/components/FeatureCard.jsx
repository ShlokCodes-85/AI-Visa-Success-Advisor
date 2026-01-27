function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 cursor-pointer transition-all duration-300 hover:border-blue-600 hover:shadow-lg text-center group-hover/container:scale-95 group-hover/container:opacity-70 hover:!scale-105 hover:!opacity-100 h-80 flex flex-col items-center justify-center">
      <div className="text-6xl mb-6 flex justify-center items-center text-blue-600 transition-all duration-300 group-hover/container:opacity-100 hover:opacity-50">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 transition-all duration-300 group-hover/container:opacity-100 hover:opacity-50">{title}</h3>
      <p className="text-gray-600 text-center leading-relaxed">{description}</p>
    </div>
  );
}

export default FeatureCard;
