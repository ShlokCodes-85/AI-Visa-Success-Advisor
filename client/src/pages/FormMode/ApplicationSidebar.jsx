import { Check } from "lucide-react";

export default function Sidebar({ sections, currentSection, setCurrentSection, completedSections = [] }) {
  return (
    <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-fit sticky top-8">
      <h2 className="font-bold text-lg text-gray-900 mb-6">Application Progress</h2>

      <div className="space-y-2">
        {sections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => {
                setCurrentSection(section.id);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all border focus:outline-none ${
                currentSection === section.id
                  ? "bg-blue-50 border-blue-500 text-blue-600 font-medium"
                  : "bg-white border-black text-black hover:bg-gray-50"
              }`}
            >
              {/* Circle with checkmark or outline */}
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full font-medium transition-all flex-shrink-0 ${
                  completedSections.includes(section.id)
                    ? "bg-blue-600 text-white"
                    : currentSection === section.id
                    ? "border-2 border-dashed border-blue-600"
                    : "border-2 border-dashed border-black"
                }`}
              >
                {completedSections.includes(section.id) && (
                  <Check className="w-4 h-4" />
                )}
              </div>

              <span className="flex-1 text-left text-sm">{section.title}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
