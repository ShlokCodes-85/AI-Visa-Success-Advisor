import { useEffect, useState } from "react";
import { FiEdit, FiMessageCircle } from "react-icons/fi";

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
import ExamInfo from "./sections/ExamInfo";
import { useApplicationContext } from "../../contexts/ApplicationContext";
import { formatFormDataForLLM } from "../../utils/formDataFormatter";

export default function ApplicationForm() {
  const { setApplicationData } = useApplicationContext();
  const [mode, setMode] = useState("form");
  const [currentSection, setCurrentSection] = useState(1);
  const [completedSections, setCompletedSections] = useState([]);
  const [errors, setErrors] = useState({});
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    countryOfResidency: "",
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
    requiredCurrency: "",
    requiredFunding: "",
    sponsorName: "",
    sponsorRelation: "",
    propertyOwnership: "",
    familyMembers: "",
    employment: "",
    sopText: "",
    hasInterviewExperience: "",
    visaDestinationCountry: "",
    visaStatus: "",

    applicationYear: "",
    rejectionReason: "",
    deportationOrIssues: "",
    deportationOrIssuesDetails: "",

    // Exam section
    examType: "",
    examScore: "",
  });

  // Update context with formatted application data whenever formData changes
  useEffect(() => {
    const formattedData = formatFormDataForLLM(formData);
    setApplicationData(formattedData);
  }, [formData, setApplicationData]);

  // Fetch user's chats from backend on component mount
  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, skipping chat fetch");
        return;
      }

      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${BACKEND_URL}/api/chats`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.chats) {
            console.log("Loaded", data.chats.length, "chats from backend");
            // Convert backend format to frontend format
            const formattedChats = data.chats.map(chat => ({
              id: chat._id,
              title: chat.title,
              createdAt: chat.createdAt,
              updatedAt: chat.updatedAt,
            }));
            setChats(formattedChats);
          }
        } else {
          console.error("Failed to fetch chats:", response.status);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []); // Run once on mount

  // Load messages when activeChat changes
  useEffect(() => {
    const loadChatMessages = async () => {
      if (!activeChat) {
        console.log("No active chat, skipping message load");
        return;
      }
      
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token, skipping message load");
        return;
      }

      // Skip if messages already loaded
      if (chatMessages[activeChat] && chatMessages[activeChat].length > 0) {
        console.log("Messages already loaded for chat:", activeChat, "Count:", chatMessages[activeChat].length);
        return;
      }

      console.log("Loading messages for chat:", activeChat);
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${BACKEND_URL}/api/chats/${activeChat}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        console.log("Fetch response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched chat data:", data);
          
          if (data.success && data.chat && data.chat.messages) {
            console.log("Loaded", data.chat.messages.length, "messages for chat:", activeChat);
            
            // Convert backend messages to frontend format
            const formattedMessages = data.chat.messages.map((msg, index) => ({
              id: index,
              type: msg.role === "user" ? "user" : "bot",
              text: msg.content,
              timestamp: new Date(msg.timestamp),
            }));
            
            console.log("Formatted messages:", formattedMessages);
            
            setChatMessages((prev) => ({
              ...prev,
              [activeChat]: formattedMessages,
            }));
          } else {
            console.log("No messages found in chat data");
          }
        } else {
          console.error("Failed to fetch chat messages, status:", response.status);
        }
      } catch (error) {
        console.error("Error loading chat messages:", error);
      }
    };

    loadChatMessages();
  }, [activeChat]); // eslint-disable-line react-hooks/exhaustive-deps

  const validateSection = (sectionId) => {
    const newErrors = {};
    const requiredFields = {
      1: ["fullName", "dateOfBirth", "nationality", "contactEmail", "phoneNumber"],
      2: ["educationLevel", "institution", "fieldOfStudy", "graduationYear", "gpa"],
      3: ["courseType", "universityName", "courseName", "startDate"],
      4: [],
      5: ["familyIncome", "savingsAmount", "sponsorName", "sponsorRelation"],
      6: ["propertyOwnership", "familyMembers", "employment"],
      7: ["sopText"],
      8: ["hasInterviewExperience"],
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
    { id: 4, title: "Exam Information" },
    { id: 5, title: "Financial Proof" },
    { id: 6, title: "Home Country Ties" },
    { id: 7, title: "Statement of Purpose (SOP)" },
    { id: 8, title: "Interview History" },
  ];

  const validateField = (fieldName, fieldValue) => {
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
        return <ExamInfo formData={formData} setFormData={setFormData} errors={errors} />;
      case 5:
        return <FinancialProof formData={formData} handleInputChange={handleInputChange} errors={errors} />;
      case 6:
        return <HomeCountryTies formData={formData} handleInputChange={handleInputChange} errors={errors} />;
      case 7:
        return <StatementOfPurpose formData={formData} handleInputChange={handleInputChange} errors={errors} />;
      case 8:
        return <InterviewHistory formData={formData} handleInputChange={handleInputChange} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Common NavBar */}
      <AppNavBar 
        mode={mode} 
        setMode={setMode} 
        setCurrentSection={setCurrentSection} 
        currentSection={currentSection} 
        completedSections={completedSections}
        chats={chats}
        setChats={setChats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        editingId={editingId}
        setEditingId={setEditingId}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
      />

      {/* Mobile-only segmented mode switch button (always visible on mobile) */}
      <div className="block sm:hidden mb-4 px-4 pt-4">
        <div className="flex bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full p-1 shadow-sm w-full">
          <button
            onClick={() => mode !== "form" && setMode("form")}
            className={`flex items-center justify-center gap-1 w-1/2 px-2 py-2 rounded-full text-xs font-medium transition-all focus:outline-none
              ${mode === "form"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow"
                : "bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"}
            `}
            aria-label="Switch to Form Mode"
          >
            <FiEdit className={`mr-1 ${mode === "form" ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-300"}`} size={16} />
            <span>Form</span>
          </button>
          <button
            onClick={() => mode !== "chat" && setMode("chat")}
            className={`flex items-center justify-center gap-1 w-1/2 px-2 py-2 rounded-full text-xs font-medium transition-all focus:outline-none
              ${mode === "chat"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow"
                : "bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"}
            `}
            aria-label="Switch to Chat Mode"
          >
            <FiMessageCircle className={`mr-1 ${mode === "chat" ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-300"}`} size={16} />
            <span>Chat</span>
          </button>
        </div>
      </div>

      {/* Conditional Content Based on Mode */}
      {mode === "chat" ? (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] sm:h-[calc(100vh-64px)] w-full">
          {/* Sidebar: visible only on desktop in chat mode */}
          <div className="hidden lg:block w-64 xl:w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" style={{ minHeight: 0, maxHeight: '100%' }}>
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
          <div className="flex-1 overflow-hidden">
            <ChatContent 
              activeChat={activeChat}
              chats={chats}
              messagesByChat={chatMessages}
              setMessagesByChat={setChatMessages}
            />
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-6 py-4 sm:py-8">
          <Sidebar
            sections={sections}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            completedSections={completedSections}
          />

          <div className="lg:col-span-3 flex flex-col">
            <div id="form-section-content" className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8 flex-1">
              {renderSection()}

              <div className="mt-6 sm:mt-8 flex flex-row justify-between items-end gap-3 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700 relative min-h-[60px]">
                <button
                  onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
                  disabled={currentSection === 1}
                  className="absolute left-0 bottom-0 px-6 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 text-sm shadow-sm transition-all"
                  style={{ minWidth: '110px' }}
                >
                  Previous
                </button>

                <button
                  onClick={() => {
                    if (validateSection(currentSection)) {
                      setErrors({});
                      markSectionComplete(currentSection);
                      if (currentSection < 8) setCurrentSection(currentSection + 1);
                    }
                  }}
                  className="absolute right-0 bottom-0 px-8 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 text-sm shadow-sm transition-all"
                  style={{ minWidth: '160px' }}
                >
                  {currentSection === 8 ? "Submit Form" : "Save and Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
