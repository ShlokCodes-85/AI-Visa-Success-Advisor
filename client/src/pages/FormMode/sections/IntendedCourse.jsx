import { Calendar } from 'lucide-react';

export default function IntendedCourse({ formData, handleInputChange, errors = {} }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Intended Course & University</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Please provide details about your intended course and university.</p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Type</label>
          {errors.courseType && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.courseType}</p>
          )}
          <select
            name="courseType"
            value={formData.courseType}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border ${
              errors.courseType ? "border-red-500" : "border-black dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
          >
            <option value="">Select course type</option>
            <option value="Bachelors">Bachelor's Degree</option>
            <option value="Masters">Master's Degree</option>
            <option value="PhD">PhD</option>
            <option value="Diploma">Diploma</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">University Name</label>
          {errors.universityName && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.universityName}</p>
          )}
          <input
            type="text"
            name="universityName"
            value={formData.universityName}
            onChange={handleInputChange}
            placeholder="e.g., Oxford University"
            className={`w-full px-4 py-3 border ${
              errors.universityName ? "border-red-500" : "border-black dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Name</label>
          {errors.courseName && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.courseName}</p>
          )}
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleInputChange}
            placeholder="e.g., Master of Science in Computer Science"
            className={`w-full px-4 py-3 border ${
              errors.courseName ? "border-red-500" : "border-black dark:border-gray-600"
            } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Start Date</label>
          {errors.startDate && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.startDate}</p>
          )}
          <div className="relative">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border ${
                errors.startDate ? "border-red-500" : "border-black dark:border-gray-600"
              } bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer`}
            />
            <Calendar className="absolute right-4 top-3.5 w-5 h-5 text-black dark:text-gray-300 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
