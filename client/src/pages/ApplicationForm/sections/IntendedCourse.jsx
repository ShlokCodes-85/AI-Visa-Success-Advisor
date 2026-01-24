import { Calendar } from 'lucide-react';

export default function IntendedCourse({ formData, handleInputChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Intended Course & University</h2>
      <p className="text-gray-600 mb-8">Please provide details about your intended course and university.</p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
          <select
            name="courseType"
            value={formData.courseType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-black bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Select course type</option>
            <option value="Bachelors">Bachelor's Degree</option>
            <option value="Masters">Master's Degree</option>
            <option value="PhD">PhD</option>
            <option value="Diploma">Diploma</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">University Name</label>
          <input
            type="text"
            name="universityName"
            value={formData.universityName}
            onChange={handleInputChange}
            placeholder="e.g., Oxford University"
            className="w-full px-4 py-3 border border-black bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleInputChange}
            placeholder="e.g., Master of Science in Computer Science"
            className="w-full px-4 py-3 border border-black bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Start Date</label>
          <div className="relative">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-black bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
            />
            <Calendar className="absolute right-4 top-3.5 w-5 h-5 text-black pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
