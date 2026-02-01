function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 hover:border-blue-600 dark:hover:border-blue-400 hover:shadow-lg dark:hover:shadow-blue-900/20 text-center group-hover/container:scale-95 group-hover/container:opacity-70 hover:!scale-105 hover:!opacity-100 h-80 flex flex-col items-center justify-center">
      <div className="text-6xl mb-6 flex justify-center items-center text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover/container:opacity-100 hover:opacity-50">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white transition-all duration-300 group-hover/container:opacity-100 hover:opacity-50">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">{description}</p>
    </div>
  );
}

export default FeatureCard;
