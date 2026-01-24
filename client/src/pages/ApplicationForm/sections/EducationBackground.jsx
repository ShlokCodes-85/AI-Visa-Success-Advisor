export default function EducationBackground({ formData, handleInputChange }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Education Background</h2>
      <p className="text-gray-600 mb-8">Please provide your current educational qualifications.</p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Highest Education Level</label>
          <select
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-black bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Select education level</option>
            <option value="High School">High School</option>
            <option value="Bachelors">Bachelor's Degree</option>
            <option value="Masters">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Institution Name</label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleInputChange}
            placeholder="e.g., University of Mumbai"
            className="w-full px-4 py-3 border border-black bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
          <input
            type="text"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleInputChange}
            placeholder="e.g., Computer Science"
            className="w-full px-4 py-3 border border-black bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
          <select
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-black bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
          <input
            type="number"
            name="gpa"
            value={formData.gpa}
            onChange={handleInputChange}
            placeholder="3.8"
            step="0.1"
            min="0"
            max="4"
            className="w-full px-4 py-3 border border-black bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
