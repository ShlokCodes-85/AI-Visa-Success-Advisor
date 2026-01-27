export default function InterviewHistory({ formData, handleInputChange, errors = {} }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview History</h2>
      <p className="text-gray-600 mb-8">Please provide information about any previous visa interviews.</p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Previous Interview Experience</label>
          {errors.hasInterviewExperience && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.hasInterviewExperience}</p>
          )}
          <select
            name="hasInterviewExperience"
            value={formData.hasInterviewExperience}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border ${
              errors.hasInterviewExperience ? "border-red-500" : "border-black"
            } bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
          >
            <option value="">Select option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {formData.hasInterviewExperience === "Yes" && (
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Interview Notes</label>
          {errors.interviewNotes && (
            <p className="text-red-500 text-sm font-medium mb-2">* {errors.interviewNotes}</p>
          )}
          <textarea
            name="interviewNotes"
            value={formData.interviewNotes}
            onChange={handleInputChange}
            placeholder="Describe your previous interview experience..."
            rows={6}
            className={`w-full px-4 py-3 border ${
              errors.interviewNotes ? "border-red-500" : "border-black"
            } bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none`}
          />
        </div>
      )}
    </div>
  );
}
