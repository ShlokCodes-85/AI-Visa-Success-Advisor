import { X } from 'lucide-react';
import { getVisaTypes, getRejectionReasons, getAllCountries } from "../../../utils/visaOptions";

export default function InterviewHistory({ formData, handleInputChange, errors = {}, onClearSection }) {
  const countries = getAllCountries();
  const visaTypes = formData.visaDestinationCountry
    ? getVisaTypes(formData.visaDestinationCountry)
    : [];
  const rejectionReasons = getRejectionReasons();

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Interview History</h2>
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
      <p className="text-gray-600 dark:text-gray-300 mb-8">Please provide information about any previous visa applications.</p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Do you have a previous visa application history?</label>
          {errors.hasInterviewExperience && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.hasInterviewExperience}</p>
          )}
          <select
            name="hasInterviewExperience"
            value={formData.hasInterviewExperience}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all
              ${errors.hasInterviewExperience
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"}
            `}
          >
            <option value="">Select option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {formData.hasInterviewExperience === "Yes" && (
        <div className="mt-8 space-y-6">
          {/* Destination Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination Country</label>
            {errors.visaDestinationCountry && (
              <p className="text-red-500 text-sm font-medium mb-2">* {errors.visaDestinationCountry}</p>
            )}
            <select
              name="visaDestinationCountry"
              value={formData.visaDestinationCountry || ""}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all
                ${errors.visaDestinationCountry
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"}
              `}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Visa Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Visa Status</label>
            {errors.visaStatus && (
              <p className="text-red-500 text-sm font-medium mb-2">* {errors.visaStatus}</p>
            )}
            <select
              name="visaStatus"
              value={formData.visaStatus || ""}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all
                ${errors.visaStatus
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"}
              `}
            >
              <option value="">Select option</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>

          {/* Year of Application */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year of Application</label>
              {errors.applicationYear && (
                <p className="text-red-500 text-sm font-medium mb-2">* {errors.applicationYear}</p>
              )}
              <input
                type="number"
                name="applicationYear"
                value={formData.applicationYear || ""}
                onChange={handleInputChange}
                placeholder="e.g., 2023"
                min="1950"
                max={new Date().getFullYear()}
                className={`w-full px-4 py-3 border ${
                  errors.applicationYear ? "border-red-500" : "border-transparent dark:border-gray-600"
                } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400`}
              />
            </div>
          </div>

          {/* Reason for Rejection - Only shown if status is Rejected and country is selected */}
          {formData.visaStatus === "Rejected" && formData.visaDestinationCountry && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason for Rejection</label>
              {errors.rejectionReason && (
                <p className="text-red-500 text-sm font-medium mb-2">* {errors.rejectionReason}</p>
              )}
              <select
                name="rejectionReason"
                value={formData.rejectionReason || ""}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all
                  ${errors.rejectionReason
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"}
                `}
              >
                <option value="">Select rejection reason</option>
                {rejectionReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Deportation/Issues during stay - Only shown if status is Approved */}
          {/* Deportation/Issues during stay - Only shown if status is Approved */}
          {formData.visaStatus === "Approved" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Did you face any issues during your stay or get deported?</label>
                {errors.deportationOrIssues && (
                  <p className="text-red-500 text-sm font-medium mb-2">* {errors.deportationOrIssues}</p>
                )}
                <select
                  name="deportationOrIssues"
                  value={formData.deportationOrIssues || ""}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    errors.deportationOrIssues ? "border-red-500" : "border-transparent dark:border-gray-600"
                  } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                >
                  <option value="">Select option</option>
                  <option value="No">No, had no issues</option>
                  <option value="Yes">Yes, I faced issues</option>
                  <option value="Deported">I was deported</option>
                </select>
              </div>

              {/* Details of Issues/Deportation - Only shown if Yes or Deported is selected */}
              {(formData.deportationOrIssues === "Yes" || formData.deportationOrIssues === "Deported") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {formData.deportationOrIssues === "Deported" 
                      ? "Why were you deported?" 
                      : "What issues did you face?"}
                  </label>
                  {errors.deportationOrIssuesDetails && (
                    <p className="text-red-500 text-sm font-medium mb-2">* {errors.deportationOrIssuesDetails}</p>
                  )}
                  <textarea
                    name="deportationOrIssuesDetails"
                    value={formData.deportationOrIssuesDetails || ""}
                    onChange={handleInputChange}
                    placeholder={formData.deportationOrIssues === "Deported" 
                      ? "Please explain why you were deported..."
                      : "Please describe the issues you faced..."}
                    rows={4}
                    className={`w-full px-4 py-3 border ${
                      errors.deportationOrIssuesDetails ? "border-red-500" : "border-transparent dark:border-gray-600"
                    } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none placeholder-gray-500 dark:placeholder-gray-400`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
