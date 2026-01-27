export default function FinancialProof({ formData, handleInputChange, errors = {} }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Proof</h2>
      <p className="text-gray-600 mb-8">Please provide your financial information for the visa application.</p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Annual Family Income</label>
          {errors.familyIncome && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.familyIncome}</p>
          )}
          <input
            type="number"
            name="familyIncome"
            value={formData.familyIncome}
            onChange={handleInputChange}
            placeholder="e.g., 500000"
            className={`w-full px-4 py-3 border ${
              errors.familyIncome ? "border-red-500" : "border-black"
            } bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Savings Amount</label>
          {errors.savingsAmount && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.savingsAmount}</p>
          )}
          <input
            type="number"
            name="savingsAmount"
            value={formData.savingsAmount}
            onChange={handleInputChange}
            placeholder="e.g., 1000000"
            className={`w-full px-4 py-3 border ${
              errors.savingsAmount ? "border-red-500" : "border-black"
            } bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sponsor Name</label>
          {errors.sponsorName && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.sponsorName}</p>
          )}
          <input
            type="text"
            name="sponsorName"
            value={formData.sponsorName}
            onChange={handleInputChange}
            placeholder="e.g., Raj Kumar"
            className={`w-full px-4 py-3 border ${
              errors.sponsorName ? "border-red-500" : "border-black"
            } bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sponsor Relation</label>
          {errors.sponsorRelation && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.sponsorRelation}</p>
          )}
          <select
            name="sponsorRelation"
            value={formData.sponsorRelation}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border ${
              errors.sponsorRelation ? "border-red-500" : "border-black"
            } bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
          >
            <option value="">Select relation</option>
            <option value="Self">Self</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
