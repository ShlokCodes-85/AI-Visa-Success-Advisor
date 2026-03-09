import { X } from 'lucide-react';

export default function HomeCountryTies({ formData, handleInputChange, errors = {}, onClearSection }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Home Country Ties</h2>
        {onClearSection && (
          <button
            onClick={onClearSection}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-red-300 dark:border-red-700 transition-all"
            title="Clear this section"
          >
            <X className="w-4 h-4" />
            <span>Clear Section</span>
          </button>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Please provide information about your connections to your home country.</p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Ownership</label>
          {errors.propertyOwnership && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.propertyOwnership}</p>
          )}
          <input
            type="text"
            name="propertyOwnership"
            value={formData.propertyOwnership}
            onChange={handleInputChange}
            placeholder="e.g., Residential House in Delhi"
            className={`w-full px-4 py-3 border ${
              errors.propertyOwnership ? "border-red-500" : "border-transparent dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Family Members in Home Country</label>
          {errors.familyMembers && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.familyMembers}</p>
          )}
          <input
            type="text"
            name="familyMembers"
            value={formData.familyMembers}
            onChange={handleInputChange}
            placeholder="e.g., Parents, 2 siblings"
            className={`w-full px-4 py-3 border ${
              errors.familyMembers ? "border-red-500" : "border-transparent dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employment Status</label>
          {errors.employment && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.employment}</p>
          )}
          <input
            type="text"
            name="employment"
            value={formData.employment}
            onChange={handleInputChange}
            placeholder="e.g., Self-employed"
            className={`w-full px-4 py-3 border ${
              errors.employment ? "border-red-500" : "border-transparent dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400`}
          />
        </div>
      </div>
    </div>
  );
}
