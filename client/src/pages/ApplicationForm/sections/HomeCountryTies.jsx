export default function HomeCountryTies({ formData, handleInputChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Home Country Ties</h2>
      <p className="text-gray-600 mb-8">Please provide information about your connections to your home country.</p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Ownership</label>
          <input
            type="text"
            name="propertyOwnership"
            value={formData.propertyOwnership}
            onChange={handleInputChange}
            placeholder="e.g., Residential House in Delhi"
            className="w-full px-4 py-3 border border-black bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Family Members in Home Country</label>
          <input
            type="text"
            name="familyMembers"
            value={formData.familyMembers}
            onChange={handleInputChange}
            placeholder="e.g., Parents, 2 siblings"
            className="w-full px-4 py-3 border border-black bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
          <input
            type="text"
            name="employment"
            value={formData.employment}
            onChange={handleInputChange}
            placeholder="e.g., Self-employed"
            className="w-full px-4 py-3 border border-black bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
