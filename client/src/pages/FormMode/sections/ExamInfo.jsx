import React from "react";
import examOptions from "../../../utils/examOptions";
import { getAllCountries } from "../../../utils/visaOptions";
import { getExamPlaceholder, getExamDescription } from "../../../utils/examScoringFormat";

export default function ExamInfo({ formData, setFormData, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Get country from formData
  const country = formData.visaDestinationCountry || "";
  
  // Map courseType to study level for exam lookups
  const courseTypeToLevel = {
    "Bachelors": "Bachelors",
    "Masters": "Masters",
    "PhD": "PhD",
    "Diploma": "Bachelors" // Diploma typically uses Bachelors level exams
  };
  
  const level = courseTypeToLevel[formData.courseType] || "Bachelors";
  
  // Get exams for the selected country and level
  const exams = (country && examOptions[country]) 
    ? (examOptions[country][level] || [])
    : [];

  // Get course type display label
  const getCourseTypeLabel = () => {
    const labels = {
      "Bachelors": "Bachelor's Degree",
      "Masters": "Master's Degree",
      "PhD": "PhD",
      "Diploma": "Diploma"
    };
    return labels[formData.courseType] || "Not Selected";
  };

  // Get all countries for the country selector
  const countries = getAllCountries();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Exam Information</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Please provide details about the standardized exam(s) required for your chosen country and level of study.</p>

      <div className="grid grid-cols-2 gap-6">
        {/* Country Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination Country</label>
          {errors.visaDestinationCountry && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.visaDestinationCountry}</p>
          )}
          <select
            name="visaDestinationCountry"
            value={formData.visaDestinationCountry || ""}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${
              errors.visaDestinationCountry ? "border-red-500" : "border-black dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
          >
            <option value="">Select a country</option>
            {countries.map((countryName) => (
              <option key={countryName} value={countryName}>
                {countryName}
              </option>
            ))}
          </select>
        </div>

        {/* Level of Study - Disabled (auto-filled from Intended Course) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level of Study</label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Auto-filled from Intended Course selection</p>
          <input
            type="text"
            value={getCourseTypeLabel()}
            disabled
            className="w-full px-4 py-3 border border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg cursor-not-allowed"
          />
        </div>

        {/* Exam Type - Filtered by Country and Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exam Type</label>
          {errors.examType && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.examType}</p>
          )}
          <select
            name="examType"
            value={formData.examType || ""}
            onChange={handleChange}
            disabled={!country}
            className={`w-full px-4 py-3 border ${
              errors.examType ? "border-red-500" : "border-black dark:border-gray-600"
            } ${!country ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed" : "bg-white dark:bg-gray-800"} text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
          >
            <option value="">{!country ? "Select country first" : "Select Exam"}</option>
            {exams.map((exam) => (
              <option key={exam} value={exam}>{exam}</option>
            ))}
          </select>
          {!country && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Select a destination country to see available exams</p>
          )}
        </div>

        {/* Exam Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exam Score</label>
          {errors.examScore && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.examScore}</p>
          )}
          <input
            type="text"
            name="examScore"
            value={formData.examScore || ""}
            onChange={handleChange}
            placeholder={formData.examType ? getExamPlaceholder(formData.examType) : "Select exam first"}
            disabled={!formData.examType}
            className={`w-full px-4 py-3 border ${
              errors.examScore ? "border-red-500" : "border-black dark:border-gray-600"
            } ${!formData.examType ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed" : "bg-white dark:bg-gray-800"} text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400`}
          />
          {formData.examType && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{getExamDescription(formData.examType)}</p>
          )}
        </div>

      </div>
    </div>
  );
}
