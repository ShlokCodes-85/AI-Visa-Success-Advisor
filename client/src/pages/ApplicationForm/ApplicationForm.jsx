import { useState } from "react";
import { FiMessageCircle, FiEdit, FiSettings, FiLogOut, FiUser } from "react-icons/fi";
import Sidebar from "./Sidebar";
import PersonalDetails from "./sections/PersonalDetails";
import EducationBackground from "./sections/EducationBackground";
import IntendedCourse from "./sections/IntendedCourse";
import FinancialProof from "./sections/FinancialProof";
import HomeCountryTies from "./sections/HomeCountryTies";
import StatementOfPurpose from "./sections/StatementOfPurpose";
import InterviewHistory from "./sections/InterviewHistory";

export default function ApplicationForm() {
  const [_mode, setMode] = useState("form"); // 'form' or 'chat'
  const [currentSection, setCurrentSection] = useState(1);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    dateOfBirth: "",
    passportNumber: "",
    nationality: "",
    contactEmail: "",
    phoneNumber: "",
    // Education
    educationLevel: "",
    institution: "",
    fieldOfStudy: "",
    graduationYear: "",
    gpa: "",
    // Intended Course
    courseType: "",
    universityName: "",
    courseName: "",
    startDate: "",
    // Financial Proof
    familyIncome: "",
    savingsAmount: "",
    sponsorName: "",
    sponsorRelation: "",
    // Home Country Ties
    propertyOwnership: "",
    familyMembers: "",
    employment: "",
    // Statement of Purpose
    sopText: "",
    // Interview History
    hasInterviewExperience: "",
    interviewNotes: "",
  });

  // Validation function to check if all fields in a section are filled
  const validateSection = (sectionId) => {
    const requiredFields = {
      1: ["fullName", "dateOfBirth", "passportNumber", "nationality", "contactEmail", "phoneNumber"],
      2: ["educationLevel", "institution", "fieldOfStudy", "graduationYear", "gpa"],
      3: ["courseType", "universityName", "courseName", "startDate"],
      4: ["familyIncome", "savingsAmount", "sponsorName", "sponsorRelation"],
      5: ["propertyOwnership", "familyMembers", "employment"],
      6: ["sopText"],
      7: ["hasInterviewExperience"],
    };

    const fieldsToCheck = requiredFields[sectionId] || [];
    return fieldsToCheck.every((field) => formData[field] && formData[field].toString().trim() !== "");
  };

  const markSectionComplete = (sectionId) => {
    if (validateSection(sectionId) && !completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  const sections = [
    { id: 1, title: "Personal Details", subsections: ["Contact Information", "Passport & Visa Details"] },
    { id: 2, title: "Education Background" },
    { id: 3, title: "Intended Course & University" },
    { id: 4, title: "Financial Proof" },
    { id: 5, title: "Home Country Ties" },
    { id: 6, title: "Statement of Purpose (SOP)" },
    { id: 7, title: "Interview History" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return <PersonalDetails formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return <EducationBackground formData={formData} handleInputChange={handleInputChange} />;
      case 3:
        return <IntendedCourse formData={formData} handleInputChange={handleInputChange} />;
      case 4:
        return <FinancialProof formData={formData} handleInputChange={handleInputChange} />;
      case 5:
        return <HomeCountryTies formData={formData} handleInputChange={handleInputChange} />;
      case 6:
        return <StatementOfPurpose formData={formData} handleInputChange={handleInputChange} />;
      case 7:
        return <InterviewHistory formData={formData} handleInputChange={handleInputChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <h1 className="text-xl font-bold text-gray-900">AI Visa Success Advisor</h1>
          </div>

          {/* Center Mode Buttons */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
            <button
              onClick={() => setMode("form")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-black rounded-lg font-medium text-black transition-all hover:bg-gray-50"
            >
              <FiEdit className="text-lg" />
              Form Mode
            </button>
            <button
              onClick={() => setMode("chat")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-black rounded-lg font-medium text-black transition-all hover:bg-gray-50"
            >
              <FiMessageCircle className="text-lg" />
              Chat Mode
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold hover:bg-blue-600 transition-all"
            >
              JD
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-all">
                  <FiUser className="text-lg" />
                  <span className="font-medium">Profile</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-all">
                  <FiSettings className="text-lg" />
                  <span className="font-medium">Settings</span>
                </button>
                <hr className="my-2 border-gray-200" />
                <button className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-all">
                  <FiLogOut className="text-lg" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex gap-6 px-6 py-8">
        {/* Sidebar */}
        <Sidebar
          sections={sections}
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          completedSections={completedSections}
        />

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {renderSection()}

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between pt-8 border-t border-gray-200">
            <button
              onClick={() => {
                setCurrentSection(Math.max(1, currentSection - 1));
              }}
              disabled={currentSection === 1}
              className="px-6 py-2 rounded-lg border border-black bg-white text-black font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            <button
              onClick={() => {
                // Validate current section before moving
                if (validateSection(currentSection)) {
                  markSectionComplete(currentSection);
                  if (currentSection < 7) {
                    setCurrentSection(currentSection + 1);
                  }
                } else {
                  alert("Please fill all fields in this section before continuing.");
                }
              }}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              {currentSection === 7 ? "Submit Form" : "Save and Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
