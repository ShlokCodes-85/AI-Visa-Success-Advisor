import { formatAmountWithFullCurrency } from "./currencyData";

/**
 * Format form data with currency symbols for LLM prompts
 * Adds currency symbols to all financial amounts before sending to AI backend
 */
export const formatFormDataForLLM = (formData) => {
  const formattedData = { ...formData };

  // Format financial fields with currency if currency is selected
  if (formattedData.requiredCurrency) {
    if (formattedData.requiredFunding) {
      formattedData.requiredFunding = formatAmountWithFullCurrency(
        formattedData.requiredFunding,
        formattedData.requiredCurrency
      );
    }
    if (formattedData.familyIncome) {
      formattedData.familyIncome = formatAmountWithFullCurrency(
        formattedData.familyIncome,
        formattedData.requiredCurrency
      );
    }
    if (formattedData.savingsAmount) {
      formattedData.savingsAmount = formatAmountWithFullCurrency(
        formattedData.savingsAmount,
        formattedData.requiredCurrency
      );
    }
  }

  // Optionally format exam info (no currency needed, just ensure included)
  // Already included by spreading formData, but you can customize below if needed
  return formattedData;
};

/**
 * Create a readable text representation of form data for LLM prompts
 */
export const createApplicationSummary = (formData) => {
  const formatted = formatFormDataForLLM(formData);
  
  const summary = `
# Visa Application Summary

## Personal Information
- Name: ${formatted.fullName || "N/A"}
- Date of Birth: ${formatted.dateOfBirth || "N/A"}
- Nationality: ${formatted.nationality || "N/A"}
- Email: ${formatted.contactEmail || "N/A"}
- Phone: ${formatted.phoneNumber || "N/A"}

## Education Background
- Level: ${formatted.educationLevel || "N/A"}
- Institution: ${formatted.institution || "N/A"}
- Field of Study: ${formatted.fieldOfStudy || "N/A"}
- Graduation Year: ${formatted.graduationYear || "N/A"}
- GPA: ${formatted.gpa || "N/A"}${formatted.gpaScale ? ` / ${formatted.gpaScale}` : ""}

## Intended Course
- Type: ${formatted.courseType || "N/A"}
- University: ${formatted.universityName || "N/A"}
- Course: ${formatted.courseName || "N/A"}
- Start Date: ${formatted.startDate || "N/A"}

## Financial Information
- Currency: ${formatted.requiredCurrency || "N/A"}
- College-Required Amount (I-20 for one year): ${formatted.requiredFunding || "N/A"}
- Annual Family Income: ${formatted.familyIncome || "N/A"}
- Total Savings: ${formatted.savingsAmount || "N/A"}
- Sponsor: ${formatted.sponsorName || "N/A"} (${formatted.sponsorRelation || "N/A"})

## Home Country Ties
- Property Ownership: ${formatted.propertyOwnership || "N/A"}
- Family Members: ${formatted.familyMembers || "N/A"}
- Employment: ${formatted.employment || "N/A"}

## Statement of Purpose
${formatted.sopText || "N/A"}

## Previous Visa Experience
- Has Experience: ${formatted.hasInterviewExperience === "Yes" ? "Yes" : "No"}
${formatted.hasInterviewExperience === "Yes" ? `
- Destination Country: ${formatted.visaDestinationCountry || "N/A"}
- Visa Status: ${formatted.visaStatus || "N/A"}
- Application Year: ${formatted.applicationYear || "N/A"}
${formatted.visaStatus === "Rejected" ? `- Rejection Reason: ${formatted.rejectionReason || "N/A"}` : ""}
${formatted.visaStatus === "Approved" ? `
- Issues/Deportation: ${formatted.deportationOrIssues || "N/A"}
${formatted.deportationOrIssues !== "No" ? `- Details: ${formatted.deportationOrIssuesDetails || "N/A"}` : ""}
` : ""}
` : ""}
`;

  return summary;
};
