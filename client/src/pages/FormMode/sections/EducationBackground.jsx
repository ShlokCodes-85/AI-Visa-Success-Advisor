import FormField from '../../../components/FormField';

export default function EducationBackground({ formData, handleInputChange, errors = {} }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);

  const gpaScales = [
    { value: "4.0", label: "4.0" },
    { value: "5.0", label: "5.0" },
    { value: "10.0", label: "10.0" },
    { value: "100", label: "100 (Percentage)" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Education Background</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Please provide your current educational qualifications.</p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Highest Education Level</label>
          {errors.educationLevel && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.educationLevel}</p>
          )}
          <select
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border ${
              errors.educationLevel ? "border-red-500" : "border-transparent dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
          >
            <option value="">Select education level</option>
            <option value="High School">High School</option>
            <option value="Bachelors">Bachelor's Degree</option>
            <option value="Masters">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
        </div>

        <FormField
          label="Institution Name"
          name="institution"
          value={formData.institution}
          onChange={handleInputChange}
          placeholder="e.g., University of Mumbai"
          error={errors.institution}
        />

        <FormField
          label="Field of Study"
          name="fieldOfStudy"
          value={formData.fieldOfStudy}
          onChange={handleInputChange}
          placeholder="e.g., Computer Science"
          error={errors.fieldOfStudy}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Graduation Year</label>
          {errors.graduationYear && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.graduationYear}</p>
          )}
          <select
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border ${
              errors.graduationYear ? "border-red-500" : "border-transparent dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
          >
            <option value="">Select graduation year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GPA Scale</label>
          {errors.gpaScale && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.gpaScale}</p>
          )}
          <select
            name="gpaScale"
            value={formData.gpaScale || ""}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border ${
              errors.gpaScale ? "border-red-500" : "border-transparent dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
          >
            <option value="">Select Scale</option>
            {gpaScales.map((scale) => (
              <option key={scale.value} value={scale.value}>
                {scale.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {formData.gpaScale === "100" ? "Percentage / GPA" : "Percentage / GPA"} (Scale: {formData.gpaScale || "Select Scale"})
          </label>
          {errors.gpa && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.gpa}</p>
          )}
          <input
            type="number"
            name="gpa"
            value={formData.gpa}
            onChange={handleInputChange}
            placeholder={`e.g., ${formData.gpaScale === "100" ? "85" : "3.8"}`}
            disabled={!formData.gpaScale}
            className={`w-full px-4 py-3 border ${
              errors.gpa ? "border-red-500" : "border-transparent dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400 ${
              !formData.gpaScale ? "opacity-50 cursor-not-allowed" : ""
            }`}
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
}
