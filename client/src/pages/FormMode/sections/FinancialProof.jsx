import { X } from 'lucide-react';
import { getAllCurrencies, getCurrencyDetails, getCurrencyDisplay } from "../../../utils/currencyData";

export default function FinancialProof({ formData, handleInputChange, errors = {}, onClearSection }) {
  const currencies = getAllCurrencies();
  const selectedCurrency = formData.requiredCurrency ? getCurrencyDetails(formData.requiredCurrency) : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Financial Proof</h2>
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
      <p className="text-gray-600 dark:text-gray-300 mb-8">Please provide your financial information for the visa application.</p>

      {/* Currency Selection */}
      <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Currency for Financial Information</label>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Choose the currency used in your college requirement document</p>
        <select
          name="requiredCurrency"
          value={formData.requiredCurrency || ""}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all
            ${errors.requiredCurrency
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"}
          `}
        >
          <option value="">Select a currency</option>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {getCurrencyDisplay(currency)} - {getCurrencyDetails(currency).name}
            </option>
          ))}
        </select>
      </div>

      {/* College-Required Amount (I-20 for One Year) */}
      {formData.requiredCurrency && (
        <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">College-Required Amount (I-20 for One Year)</label>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Enter the amount mentioned in your I-20 for one year (tuition + living expenses).</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{selectedCurrency?.flag}</span>
            <span className="text-xl font-bold text-gray-700 dark:text-gray-300 min-w-[60px]">{selectedCurrency?.symbol}</span>
            <input
              type="number"
              name="requiredFunding"
              value={formData.requiredFunding || ""}
              onChange={handleInputChange}
              placeholder="Enter I-20 one-year amount"
              className={`flex-1 px-4 py-3 border ${
                errors.requiredFunding ? "border-red-500" : "border-transparent dark:border-gray-600"
              } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400`}
            />
          </div>
          {errors.requiredFunding && (
            <p className="text-red-500 text-sm font-medium mt-2">* {errors.requiredFunding}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Annual Family Income */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Annual Family Income</label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{formData.requiredCurrency || "Select currency first"}</p>
          {errors.familyIncome && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.familyIncome}</p>
          )}
          <div className="flex items-center gap-2">
            {selectedCurrency && (
              <>
                <span className="text-lg font-bold">{selectedCurrency.flag}</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium min-w-[40px]">{selectedCurrency.symbol}</span>
              </>
            )}
            <input
              type="number"
              name="familyIncome"
              value={formData.familyIncome || ""}
              onChange={handleInputChange}
              placeholder="e.g., 500000"
              disabled={!formData.requiredCurrency}
              className={`flex-1 px-4 py-3 border ${
                errors.familyIncome ? "border-red-500" : "border-transparent dark:border-gray-600"
              } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          </div>
        </div>

        {/* Total Savings Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Savings Amount</label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{formData.requiredCurrency || "Select currency first"}</p>
          {errors.savingsAmount && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.savingsAmount}</p>
          )}
          <div className="flex items-center gap-2">
            {selectedCurrency && (
              <>
                <span className="text-lg font-bold">{selectedCurrency.flag}</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium min-w-[40px]">{selectedCurrency.symbol}</span>
              </>
            )}
            <input
              type="number"
              name="savingsAmount"
              value={formData.savingsAmount || ""}
              onChange={handleInputChange}
              placeholder="e.g., 1000000"
              disabled={!formData.requiredCurrency}
              className={`flex-1 px-4 py-3 border ${
                errors.savingsAmount ? "border-red-500" : "border-transparent dark:border-gray-600"
              } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sponsor Name</label>
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
              errors.sponsorName ? "border-red-500" : "border-transparent dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sponsor Relation</label>
          {errors.sponsorRelation && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.sponsorRelation}</p>
          )}
          <select
            name="sponsorRelation"
            value={formData.sponsorRelation}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all
              ${errors.sponsorRelation
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"}
            `}
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
