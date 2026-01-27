import { useState } from "react";
import AppNavBar from "../../components/AppNavBar";
import ChatContent from "../ChatMode/ChatContent";
import ChatSidebar from "../ChatMode/ChatSidebar";
import Sidebar from "./ApplicationSidebar";
import PersonalDetails from "./sections/PersonalDetails";
import EducationBackground from "./sections/EducationBackground";
import IntendedCourse from "./sections/IntendedCourse";
import FinancialProof from "./sections/FinancialProof";
import HomeCountryTies from "./sections/HomeCountryTies";
import StatementOfPurpose from "./sections/StatementOfPurpose";
import InterviewHistory from "./sections/InterviewHistory";

export default function ApplicationForm() {
  const [mode, setMode] = useState("form");
  const [currentSection, setCurrentSection] = useState(1);
  const [completedSections, setCompletedSections] = useState([]);
  const [errors, setErrors] = useState({});
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    nationality: "",
    contactEmail: "",
    phoneNumber: "",
    educationLevel: "",
    institution: "",
    fieldOfStudy: "",
    graduationYear: "",
    gpaScale: "",
    gpa: "",
    courseType: "",
    universityName: "",
    courseName: "",
    startDate: "",
    familyIncome: "",
    savingsAmount: "",
    sponsorName: "",
    sponsorRelation: "",
    propertyOwnership: "",
    familyMembers: "",
    employment: "",
    sopText: "",
    hasInterviewExperience: "",
    interviewNotes: "",
  });

  const validateSection = (sectionId) => {
    const newErrors = {};
    const requiredFields = {
      1: ["fullName", "dateOfBirth", "nationality", "contactEmail", "phoneNumber"],
      2: ["educationLevel", "institution", "fieldOfStudy", "graduationYear", "gpa"],
      3: ["courseType", "universityName", "courseName", "startDate"],
      4: ["familyIncome", "savingsAmount", "sponsorName", "sponsorRelation"],
      5: ["propertyOwnership", "familyMembers", "employment"],
      6: ["sopText"],
      7: ["hasInterviewExperience"],
    };

    const fieldLabels = {
      fullName: "Full Name",
      dateOfBirth: "Date of Birth",
      nationality: "Nationality",
      contactEmail: "Email",
      phoneNumber: "Phone Number",
      educationLevel: "Education Level",
      institution: "Institution",
      fieldOfStudy: "Field of Study",
      graduationYear: "Graduation Year",
      gpaScale: "GPA Scale",
      gpa: "GPA",
      courseType: "Course Type",
      universityName: "University Name",
      courseName: "Course Name",
      startDate: "Start Date",
      familyIncome: "Family Income",
      savingsAmount: "Savings Amount",
      sponsorName: "Sponsor Name",
      sponsorRelation: "Sponsor Relation",
      propertyOwnership: "Property Ownership",
      familyMembers: "Family Members",
      employment: "Employment",
      sopText: "Statement of Purpose",
      hasInterviewExperience: "Interview Experience",
    };

    const fields = requiredFields[sectionId] || [];
    let isValid = true;

    fields.forEach((field) => {
      const value = formData[field];
      if (!value || value.toString().trim() === "") {
        newErrors[field] = `${fieldLabels[field]} is required`;
        isValid = false;
      } else {
        // Field-specific validations
        if (field === "dateOfBirth") {
          const birthDate = new Date(value);
          const today = new Date();
          
          // Check if date is in the future
          if (birthDate > today) {
            newErrors[field] = "Birth date cannot be in the future";
            isValid = false;
          } else {
            // Validate actual date existence (e.g., Feb 30 doesn't exist)
            const dateStr = value;
            const [year, month, day] = dateStr.split('-').map(Number);
            const testDate = new Date(year, month - 1, day);
            
            if (testDate.getFullYear() !== year || 
                testDate.getMonth() !== month - 1 || 
                testDate.getDate() !== day) {
              newErrors[field] = "Please enter a valid date";
              isValid = false;
            }
          }
        } else if (field === "gpaScale") {
          // GPA Scale is required but already validated as non-empty above
        } else if (field === "gpa") {
          const gpaValue = parseFloat(value);
          const gpaScaleValue = parseFloat(formData.gpaScale) || 4.0;
          const isPercentage = formData.gpaScale === "100";
          
          if (isNaN(gpaValue)) {
            newErrors[field] = isPercentage ? "Percentage must be a valid number" : "GPA must be a valid number";
            isValid = false;
          } else if (gpaValue < 0 || gpaValue > gpaScaleValue) {
            newErrors[field] = isPercentage 
              ? `Percentage should be between 0 and ${gpaScaleValue}` 
              : `GPA should be between 0 and ${gpaScaleValue}`;
            isValid = false;
          }
        } else if (field === "contactEmail") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors[field] = "Please enter a valid email address";
            isValid = false;
          }
        } else if (field === "phoneNumber") {
          const phoneRegex = /^[0-9+\-\s()]{10,}$/;
          if (!phoneRegex.test(value)) {
            newErrors[field] = "Please enter a valid phone number";
            isValid = false;
          }
        } else if (field === "graduationYear") {
          const year = parseInt(value);
          if (year < 1900 || year > new Date().getFullYear() + 10) {
            newErrors[field] = "Please enter a valid year";
            isValid = false;
          }
        } else if (field === "gpa") {
          const gpa = parseFloat(value);
          if (gpa < 0 || gpa > 4.0) {
            newErrors[field] = "GPA should be between 0 and 4.0";
            isValid = false;
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const markSectionComplete = (sectionId) => {
    if (validateSection(sectionId) && !completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  const sections = [
    { id: 1, title: "Personal Details" },
    { id: 2, title: "Education Background" },
    { id: 3, title: "Intended Course & University" },
    { id: 4, title: "Financial Proof" },
    { id: 5, title: "Home Country Ties" },
    { id: 6, title: "Statement of Purpose (SOP)" },
    { id: 7, title: "Interview History" },
  ];

  const validateField = (fieldName, fieldValue) => {
    const fieldLabels = {
      fullName: "Full Name",
      dateOfBirth: "Date of Birth",
      nationality: "Nationality",
      contactEmail: "Email",
      phoneNumber: "Phone Number",
      educationLevel: "Education Level",
      institution: "Institution",
      fieldOfStudy: "Field of Study",
      graduationYear: "Graduation Year",
      gpaScale: "GPA Scale",
      gpa: "GPA",
      courseType: "Course Type",
      universityName: "University Name",
      courseName: "Course Name",
      startDate: "Start Date",
      familyIncome: "Family Income",
      savingsAmount: "Savings Amount",
      sponsorName: "Sponsor Name",
      sponsorRelation: "Sponsor Relation",
      propertyOwnership: "Property Ownership",
      familyMembers: "Family Members",
      employment: "Employment",
      sopText: "Statement of Purpose",
      hasInterviewExperience: "Interview Experience",
      interviewNotes: "Interview Notes",
    };

    let error = null;

    // Check if field is empty
    if (!fieldValue || fieldValue.toString().trim() === "") {
      return null; // Don't show "required" error in real-time, only on save
    }

    // Field-specific validations
    if (fieldName === "dateOfBirth") {
      const birthDate = new Date(fieldValue);
      const today = new Date();
      
      if (birthDate > today) {
        error = "Birth date cannot be in the future";
      } else {
        const dateStr = fieldValue;
        const [year, month, day] = dateStr.split('-').map(Number);
        const testDate = new Date(year, month - 1, day);
        
        if (testDate.getFullYear() !== year || 
            testDate.getMonth() !== month - 1 || 
            testDate.getDate() !== day) {
          error = "Please enter a valid date";
        }
      }
    } else if (fieldName === "gpa") {
      const gpaValue = parseFloat(fieldValue);
      const gpaScaleValue = parseFloat(formData.gpaScale) || 4.0;
      const isPercentage = formData.gpaScale === "100";
      
      if (isNaN(gpaValue)) {
        error = isPercentage ? "Percentage must be a valid number" : "GPA must be a valid number";
      } else if (gpaValue < 0 || gpaValue > gpaScaleValue) {
        error = isPercentage 
          ? `Percentage should be between 0 and ${gpaScaleValue}` 
          : `GPA should be between 0 and ${gpaScaleValue}`;
      }
    } else if (fieldName === "contactEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fieldValue)) {
        error = "Please enter a valid email address";
      }
    } else if (fieldName === "phoneNumber") {
      const phoneRegex = /^[0-9+\-\s()]{10,}$/;
      if (!phoneRegex.test(fieldValue)) {
        error = "Please enter a valid phone number";
      }
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Real-time validation
    const fieldError = validateField(name, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: fieldError
    }));
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return <PersonalDetails formData={formData} handleInputChange={handleInputChange} errors={errors} />;
      case 2:
        return <EducationBackground formData={formData} handleInputChange={handleInputChange} errors={errors} />;
      case 3:
        return <IntendedCourse formData={formData} handleInputChange={handleInputChange} errors={errors} />;
      case 4:
        return <FinancialProof formData={formData} handleInputChange={handleInputChange} errors={errors} />;
      case 5:
        return <HomeCountryTies formData={formData} handleInputChange={handleInputChange} errors={errors} />;
      case 6:
        return <StatementOfPurpose formData={formData} handleInputChange={handleInputChange} errors={errors} />;
      case 7:
        return <InterviewHistory formData={formData} handleInputChange={handleInputChange} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Common NavBar */}
      <AppNavBar mode={mode} setMode={setMode} />

      {/* Conditional Content Based on Mode */}
      {mode === "chat" ? (
        <div className="flex h-[calc(100vh-64px)]">
          <div className="w-80">
            <ChatSidebar 
              chats={chats}
              setChats={setChats}
              activeChat={activeChat}
              setActiveChat={setActiveChat}
              editingId={editingId}
              setEditingId={setEditingId}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
            />
          </div>
          <div className="flex-1">
            <ChatContent 
              activeChat={activeChat}
              chats={chats}
            />
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto flex gap-6 px-6 py-8">
          <Sidebar
            sections={sections}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            completedSections={completedSections}
          />

          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {renderSection()}

            <div className="mt-8 flex justify-between pt-8 border-t border-gray-200">
              <button
                onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
                disabled={currentSection === 1}
                className="px-6 py-2 rounded-lg border border-black bg-white text-black font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={() => {
                  if (validateSection(currentSection)) {
                    setErrors({});
                    markSectionComplete(currentSection);
                    if (currentSection < 7) setCurrentSection(currentSection + 1);
                  }
                }}
                className="px-8 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                {currentSection === 7 ? "Submit Form" : "Save and Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
