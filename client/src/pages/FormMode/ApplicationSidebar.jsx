import { Check } from "lucide-react";

export default function Sidebar({ sections, currentSection, setCurrentSection, completedSections = [] }) {
  return (
    <div className="hidden lg:block w-48 xl:w-64 bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 h-fit sticky top-8">
      <h2 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">Application Progress</h2>

      <div className="space-y-1.5 sm:space-y-2">
        {sections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => {
                setCurrentSection(section.id);
              }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-all border focus:outline-none text-xs sm:text-sm min-h-[40px] sm:min-h-[auto] ${
                currentSection === section.id
                  ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-300 font-medium"
                  : "bg-white dark:bg-gray-900 border-transparent dark:border-gray-600 text-black dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {/* Circle with checkmark or outline */}
              <div
                className={`flex items-center justify-center w-5 sm:w-6 h-5 sm:h-6 rounded-full font-medium transition-all flex-shrink-0 text-xs ${
                  completedSections.includes(section.id)
                    ? "bg-blue-600 text-white"
                    : currentSection === section.id
                    ? "border-2 border-dashed border-blue-600"
                    : "border-2 border-dashed border-transparent dark:border-gray-600"
                }`}
              >
                {completedSections.includes(section.id) && (
                  <Check className="w-3 sm:w-4 h-3 sm:h-4" />
                )}
              </div>

              <span className="flex-1 text-left">{section.title}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
