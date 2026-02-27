/**
 * Utility functions for saving and managing visa application analyses
 */

/**
 * Save a new analysis to the backend
 * @param {Object} analysisData - The analysis data to save
 * @param {number} analysisData.percentage - Success probability (0-100)
 * @param {Array} analysisData.reasoning - Array of reasoning factors
 * @param {Array} analysisData.improvements - Array of improvement suggestions
 * @param {Object} analysisData.formData - The complete form data
 * @param {string} [analysisData.title] - Optional custom title
 * @param {Object} [analysisData.shapValues] - Optional SHAP values (to be added later)
 * @param {Object} [analysisData.limeExplanation] - Optional LIME explanation (to be added later)
 * @returns {Promise<Object>} The saved analysis response
 */
export async function saveAnalysis(analysisData) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const response = await fetch(`${BACKEND_URL}/api/analyses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(analysisData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save analysis");
  }

  return response.json();
}

/**
 * Example usage when submitting the application form:
 * 
 * // After getting AI prediction results
 * const analysisData = {
 *   title: "Visa Analysis - January 2024",
 *   percentage: 75, // AI prediction percentage
 *   reasoning: [
 *     {
 *       factor: "Strong Academic Background",
 *       impact: "positive",
 *       description: "Your GPA of 3.8 demonstrates strong academic performance",
 *       weight: 0.3
 *     },
 *     {
 *       factor: "Limited Financial Proof",
 *       impact: "negative",
 *       description: "Bank balance is below recommended amount for your destination",
 *       weight: 0.25
 *     }
 *   ],
 *   improvements: [
 *     {
 *       category: "Financial Documentation",
 *       suggestion: "Increase bank balance to at least $20,000 or provide additional sponsor letters",
 *       priority: "high"
 *     },
 *     {
 *       category: "Statement of Purpose",
 *       suggestion: "Add more specific career goals and how they align with the chosen course",
 *       priority: "medium"
 *     }
 *   ],
 *   formData: formDataObject, // Complete form submission data
 *   shapValues: null, // Will be populated when SHAP analysis is implemented
 *   limeExplanation: null // Will be populated when LIME analysis is implemented
 * };
 * 
 * try {
 *   const result = await saveAnalysis(analysisData);
 *   console.log("Analysis saved:", result);
 *   // Navigate to results page
 *   navigate(`/results/${result.analysis.id}`);
 * } catch (error) {
 *   console.error("Failed to save analysis:", error);
 * }
 */

/**
 * Fetch all analyses for the current user
 * @returns {Promise<Array>} Array of analyses
 */
export async function fetchAnalyses() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const response = await fetch(`${BACKEND_URL}/api/analyses`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch analyses");
  }

  const data = await response.json();
  return data.analyses;
}

/**
 * Fetch a specific analysis by ID
 * @param {string} analysisId - The analysis ID
 * @returns {Promise<Object>} The analysis object
 */
export async function fetchAnalysisById(analysisId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const response = await fetch(`${BACKEND_URL}/api/analyses/${analysisId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch analysis");
  }

  const data = await response.json();
  return data.analysis;
}

/**
 * Delete an analysis
 * @param {string} analysisId - The analysis ID to delete
 * @returns {Promise<void>}
 */
export async function deleteAnalysis(analysisId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const response = await fetch(`${BACKEND_URL}/api/analyses/${analysisId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete analysis");
  }
}

/**
 * Update analysis title
 * @param {string} analysisId - The analysis ID
 * @param {string} title - New title
 * @returns {Promise<Object>} Updated analysis
 */
export async function updateAnalysisTitle(analysisId, title) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const response = await fetch(`${BACKEND_URL}/api/analyses/${analysisId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error("Failed to update analysis");
  }

  return response.json();
}
