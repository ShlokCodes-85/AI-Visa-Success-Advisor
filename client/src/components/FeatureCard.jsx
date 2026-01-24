function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 cursor-pointer transition-all duration-300 hover:border-blue-600 hover:shadow-lg text-center group-hover/container:scale-95 group-hover/container:opacity-70 hover:!scale-105 hover:!opacity-100">
      <div className="text-4xl mb-4 flex justify-center items-center text-blue-600">{icon}</div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default FeatureCard;
