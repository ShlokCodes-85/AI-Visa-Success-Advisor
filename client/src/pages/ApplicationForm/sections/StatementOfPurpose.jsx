export default function StatementOfPurpose({ formData, handleInputChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Statement of Purpose (SOP)</h2>
      <p className="text-gray-600 mb-8">Write a compelling statement about why you want to study abroad and your future goals.</p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Your Statement of Purpose</label>
        <textarea
          name="sopText"
          value={formData.sopText}
          onChange={handleInputChange}
          placeholder="Write your statement of purpose here..."
          rows={10}
          className="w-full px-4 py-3 border border-black bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
        <p className="text-sm text-gray-500 mt-2">Minimum 250 words recommended</p>
      </div>
    </div>
  );
}
