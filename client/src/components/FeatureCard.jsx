function FeatureCard({ title, description, icon, isHovered, isDimmed, onMouseEnter, onMouseLeave }) {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 text-center h-80 flex flex-col items-center justify-center
        ${isHovered ? 'scale-105 border-blue-600 dark:border-blue-400 shadow-lg dark:shadow-blue-900/20' : ''}
        ${isDimmed ? 'scale-95 opacity-70' : ''}
        ${!isHovered && !isDimmed ? 'hover:border-blue-600 dark:hover:border-blue-400 hover:shadow-lg dark:hover:shadow-blue-900/20' : ''}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="text-6xl mb-6 flex justify-center items-center text-blue-600 dark:text-blue-400 transition-all duration-300">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white transition-all duration-300">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">{description}</p>
    </div>
  );
}

export default FeatureCard;
