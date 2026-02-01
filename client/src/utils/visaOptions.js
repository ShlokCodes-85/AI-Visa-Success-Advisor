// Common rejection reasons for all countries
const commonRejectionReasons = [
  "Insufficient Financial Proof",
  "Weak Academic Credentials",
  "Unclear Statement of Purpose",
  "Employment Letter Issues",
  "Health/Medical Concerns",
  "Immigration History Problems",
  "Document Verification Failed",
  "Interview Performance",
  "Language Proficiency Concerns",
  "Poor Academic Record",
  "Unconvincing Study Plan",
  "Weak Employment Prospects",
  "Previous Visa Violations",
  "Document Forgery Suspected",
  "Security Concerns",
  "Health Screening Failed",
  "Documentation Incomplete",
  "Salary Below Required Level",
  "Skills Not in Demand",
  "Character Assessment Failed",
  "Credential Verification Failed",
  "No Clear Study/Work Purpose",
  "Employment Contract Issues",
  "Health Requirements Not Met",
  "Security/Background Issues",
  "Diploma Not Recognized",
  "Return Risk Assessment High",
];

// Visa types and rejection reasons for each country
export const visaData = {
  Japan: {
    flag: "🇯🇵",
    visaTypes: [
      "Student Visa",
      "Work Visa (Skilled Worker)",
      "Temporary Visitor",
      "Intra-company Transfer",
      "Spouse/Dependent Visa",
    ],
  },
  "South Korea": {
    flag: "🇰🇷",
    visaTypes: [
      "Student Visa (D-2)",
      "Work Visa (E-1)",
      "Visit Visa (C-3)",
      "Temporary Visit Visa (B-1/B-2)",
      "Residence Visa (F-2)",
    ],
  },
  Singapore: {
    flag: "🇸🇬",
    visaTypes: [
      "Student Pass",
      "Employment Pass",
      "EntrePass (Entrepreneur)",
      "Dependant Pass",
      "Visit Pass",
    ],
  },
  "New Zealand": {
    flag: "🇳🇿",
    visaTypes: [
      "Student Visa",
      "Essential Skills Work Visa",
      "Long Term Skill Shortage List (LTSSL)",
      "Resident Visa",
      "Visitor Visa",
    ],
  },
  Sweden: {
    flag: "🇸🇪",
    visaTypes: [
      "Student Residence Permit",
      "Work Residence Permit",
      "Residence Card (EU/EEA)",
      "Family Reunification",
      "Business/Self-Employment",
    ],
  },
  Denmark: {
    flag: "🇩🇰",
    visaTypes: [
      "Student Residence Permit",
      "Work Permit",
      "Positive List (Skilled Worker)",
      "Entrepreneurs Scheme",
      "Family Reunification",
    ],
  },
  Finland: {
    flag: "🇫🇮",
    visaTypes: [
      "Student Residence Permit",
      "Work-based Residence Permit",
      "Entrepreneur Permit",
      "Family Ties Residence Permit",
      "ICT Employee Permit",
    ],
  },
  Norway: {
    flag: "🇳🇴",
    visaTypes: [
      "Student Residence Permit",
      "Work Residence Permit",
      "Self-Employment Permit",
      "Key Personnel Permit",
      "Family Reunification Permit",
    ],
  },
  Germany: {
    flag: "🇩🇪",
    visaTypes: [
      "Student Visa",
      "Work Visa (Skilled)",
      "EU Blue Card (Highly Skilled)",
      "Freelancer Visa",
      "Family Reunification Visa",
    ],
  },
  Netherlands: {
    flag: "🇳🇱",
    visaTypes: [
      "Residence Permit - Study",
      "Residence Permit - Work (ICT/Intra-Corporate)",
      "Highly Skilled Migrant",
      "Startup Visa",
      "Family Reunification",
    ],
  },
  France: {
    flag: "🇫🇷",
    visaTypes: [
      "Student Visa (Visiteur)",
      "Work Visa",
      "Skilled Worker Visa (Carte Bleue)",
      "Entrepreneur/Professional Visa",
      "Family Reunification Visa",
    ],
  },
  Switzerland: {
    flag: "🇨🇭",
    visaTypes: [
      "Student Permit",
      "Work Permit (Issued by Cantons)",
      "Specialist Permit (Highly Qualified)",
      "Entrepreneur Permit",
      "Family Reunification Permit",
    ],
  },
  Ireland: {
    flag: "🇮🇪",
    visaTypes: [
      "Student Visa",
      "Critical Skills Employment Permit",
      "General Employment Permit",
      "Intra-Company Transfer",
      "Dependant Visa",
    ],
  },
  USA: {
    flag: "🇺🇸",
    visaTypes: [
      "F-1 Student Visa",
      "H-1B Work Visa",
      "L-1 Intra-Company Transfer",
      "O-1 Extraordinary Ability",
      "EB-2/EB-3 Immigrant Visa",
    ],
  },
  UK: {
    flag: "🇬🇧",
    visaTypes: [
      "Student Visa",
      "Skilled Worker Visa",
      "Graduate Visa",
      "Innovator Visa",
      "Family Visa",
    ],
  },
  Canada: {
    flag: "🇨🇦",
    visaTypes: [
      "Study Permit",
      "Work Permit",
      "Express Entry (PR)",
      "Provincial Nominee Program (PNP)",
      "Family Sponsorship",
    ],
  },
  Australia: {
    flag: "🇦🇺",
    visaTypes: [
      "Student Visa",
      "Skilled Independent Visa (189)",
      "Employer Sponsored Visa (482/186)",
      "Parent Visa",
      "Temporary Visit Visa",
    ],
  },
};

// Get visa types for a specific country
export const getVisaTypes = (country) => {
  return visaData[country]?.visaTypes || [];
};

// Get rejection reasons (same for all countries)
export const getRejectionReasons = () => {
  return commonRejectionReasons;
};

// Get all countries
export const getAllCountries = () => {
  return Object.keys(visaData).sort();
};
