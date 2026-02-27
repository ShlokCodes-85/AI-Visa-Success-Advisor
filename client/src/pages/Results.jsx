import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplicationContext } from "../contexts/ApplicationContext";
import ResultsNavBar from "../components/ResultsNavBar";
import PercentageCircle from "../components/PercentageCircle";
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertCircle, 
  FiTrendingUp,
  FiClock,
  FiDownload
} from "react-icons/fi";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Results() {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const { currentAnalysis } = useApplicationContext();
  const [analysis, setAnalysis] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch specific analysis or latest analysis
  useEffect(() => {
    const fetchAnalysis = async () => {
      // Priority 1: Use analysis from context if it matches the current analysisId
      if (currentAnalysis && currentAnalysis._id === analysisId) {
        setAnalysis(currentAnalysis);
        setAnalyses([currentAnalysis, ...analyses.filter(a => a._id !== analysisId)]);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      
      // For development: Use mock data if no token
      if (!token) {
        // Mock data for UI preview
        setAnalysis({
          _id: "mock-1",
          title: "Sample Analysis",
          percentage: 75,
          email: "student@example.com",
          createdAt: new Date().toISOString(),
          formData: {
            personalDetails: {
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@example.com"
            }
          },
          reasoning: [
            {
              factor: "Strong Academic Background",
              impact: "positive",
              description: "Your GPA of 3.8 demonstrates excellent academic performance which strongly supports your visa application.",
              weight: 0.3
            },
            {
              factor: "Sufficient Financial Proof",
              impact: "positive",
              description: "Bank statements show adequate funds to cover tuition and living expenses for the duration of your study.",
              weight: 0.25
            },
            {
              factor: "Limited Work Experience",
              impact: "negative",
              description: "Limited professional experience might raise questions about post-graduation plans.",
              weight: 0.15
            },
            {
              factor: "Clear Statement of Purpose",
              impact: "positive",
              description: "Well-articulated career goals and study objectives align well with the chosen program.",
              weight: 0.2
            }
          ],
          improvements: [
            {
              category: "Work Experience Documentation",
              suggestion: "Include detailed letters from employers highlighting skills relevant to your field of study",
              priority: "high"
            },
            {
              category: "Statement of Purpose",
              suggestion: "Add more specific examples of how the program aligns with your career trajectory",
              priority: "medium"
            },
            {
              category: "Home Country Ties",
              suggestion: "Strengthen documentation of family connections and property ownership in home country",
              priority: "high"
            },
            {
              category: "Language Proficiency",
              suggestion: "Consider retaking language test to improve speaking section score",
              priority: "low"
            }
          ]
        });
        setAnalyses([
          {
            _id: "mock-1",
            title: "Sample Analysis",
            percentage: 75,
            createdAt: new Date().toISOString()
          },
          {
            _id: "mock-2",
            title: "Previous Analysis",
            percentage: 62,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            _id: "mock-3",
            title: "Initial Assessment",
            percentage: 55,
            createdAt: new Date(Date.now() - 172800000).toISOString()
          }
        ]);
        setLoading(false);
        return;
      }

      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        
        if (analysisId) {
          // Fetch specific analysis
          const response = await fetch(`${BACKEND_URL}/api/analyses/${analysisId}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setAnalysis(data.analysis);
          } else {
            console.error("Failed to fetch analysis");
            navigate("/results");
          }
        }
      } catch (error) {
        console.error("Error fetching analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [analysisId, navigate]);

  // Fetch all analyses for history sidebar
  useEffect(() => {
    const fetchAnalyses = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${BACKEND_URL}/api/analyses`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAnalyses(data.analyses);
          
          // If no specific analysis is loaded, load the latest one
          if (!analysisId && data.analyses.length > 0) {
            navigate(`/results/${data.analyses[0]._id}`);
          }
        }
      } catch (error) {
        console.error("Error fetching analyses:", error);
      }
    };

    fetchAnalyses();
  }, [analysisId, navigate]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    // Header with branding
    doc.setFillColor(37, 99, 235); // Blue color
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('AI Visa Success Advisor', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Comprehensive Analysis Report', pageWidth / 2, 30, { align: 'center' });

    yPosition = 50;

    // User Information Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Applicant Information', 14, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const userName = analysis.formData?.personalDetails?.firstName && analysis.formData?.personalDetails?.lastName 
      ? `${analysis.formData.personalDetails.firstName} ${analysis.formData.personalDetails.lastName}`
      : analysis.formData?.personalDetails?.fullName || "Not Provided";
    const userEmail = analysis.formData?.personalDetails?.email || analysis.email || "Not Provided";
    const analysisDate = new Date(analysis.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });

    doc.text(`Name: ${userName}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Email: ${userEmail}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Analysis Date: ${analysisDate}`, 14, yPosition);
    yPosition += 15;

    // Success Probability Section with colored box
    const percentage = analysis.percentage;
    const statusColor = percentage >= 70 ? [16, 185, 129] : percentage >= 40 ? [234, 179, 8] : [239, 68, 68];
    const statusText = percentage >= 70 ? "Excellent Approval Chances" : percentage >= 40 ? "Moderate Approval Chances" : "Needs Improvement";

    doc.setFillColor(...statusColor);
    doc.roundedRect(14, yPosition, pageWidth - 28, 25, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(`${percentage}%`, pageWidth / 2, yPosition + 10, { align: 'center' });
    doc.setFontSize(12);
    doc.text(statusText, pageWidth / 2, yPosition + 20, { align: 'center' });
    yPosition += 35;

    // AI Reasoning Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('AI Reasoning & Key Factors', 14, yPosition);
    yPosition += 10;

    if (analysis.reasoning && analysis.reasoning.length > 0) {
      const reasoningData = analysis.reasoning.map((item, index) => [
        index + 1,
        item.factor,
        item.impact.charAt(0).toUpperCase() + item.impact.slice(1),
        item.weight ? `${(item.weight * 100).toFixed(0)}%` : 'N/A',
        item.description
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['#', 'Factor', 'Impact', 'Weight', 'Description']],
        body: reasoningData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 35 },
          2: { cellWidth: 20 },
          3: { cellWidth: 15 },
          4: { cellWidth: 'auto' }
        },
        styles: { fontSize: 9, cellPadding: 3 }
      });
      yPosition = doc.lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(10);
      doc.setFont(undefined, 'italic');
      doc.text('No reasoning data available.', 14, yPosition);
      yPosition += 15;
    }

    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    // Recommended Improvements Section
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Recommended Improvements', 14, yPosition);
    yPosition += 10;

    if (analysis.improvements && analysis.improvements.length > 0) {
      const improvementsData = analysis.improvements.map((item, index) => [
        index + 1,
        item.category,
        item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
        item.suggestion
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['#', 'Category', 'Priority', 'Suggestion']],
        body: improvementsData,
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 40 },
          2: { cellWidth: 20 },
          3: { cellWidth: 'auto' }
        },
        styles: { fontSize: 9, cellPadding: 3 }
      });
      yPosition = doc.lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(10);
      doc.setFont(undefined, 'italic');
      doc.text('No improvements suggested at this time.', 14, yPosition);
      yPosition += 15;
    }

    // Footer
    const footerY = pageHeight - 20;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.setFont(undefined, 'italic');
    doc.text('Generated by AI Visa Success Advisor - This analysis is for informational purposes only.', pageWidth / 2, footerY, { align: 'center' });
    doc.text(`Report ID: ${analysis._id}`, pageWidth / 2, footerY + 5, { align: 'center' });

    // Save the PDF
    const fileName = `Visa_Analysis_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case "positive":
        return <FiCheckCircle className="text-green-500" />;
      case "negative":
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiAlertCircle className="text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <ResultsNavBar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">No analysis found</p>
            <button
              onClick={() => navigate("/application")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
            >
              Create New Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <ResultsNavBar 
        onToggleSidebar={() => setSidebarOpen(true)}
        onCreateNew={() => navigate("/application")}
      />
      
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {/* Desktop Action Buttons */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => navigate("/application")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Analysis
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg"
              >
                <FiDownload size={18} />
                Download PDF Report
              </button>
            </div>

            {/* Percentage Circle */}
            <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-800/50 rounded-3xl shadow-lg border border-blue-100 dark:border-gray-700 p-8 mb-8 flex flex-col lg:flex-row items-start gap-8">
              <div className="flex-shrink-0 flex-1">
                <PercentageCircle 
                  percentage={analysis.percentage}
                  userName={analysis.formData?.personalDetails?.firstName && analysis.formData?.personalDetails?.lastName 
                    ? `${analysis.formData.personalDetails.firstName} ${analysis.formData.personalDetails.lastName}`
                    : analysis.formData?.personalDetails?.fullName || "User"
                  }
                  userEmail={analysis.formData?.personalDetails?.email || analysis.email || "user@example.com"}
                />
              </div>

              {/* Right Side: Status and User Details */}
              <div className="flex-1 space-y-6">
                {/* Status */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {analysis.percentage >= 70 ? (
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : analysis.percentage >= 40 ? (
                      <svg className="w-6 h-6 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <h3 className={`text-xl font-bold ${analysis.percentage >= 70 ? 'text-green-500' : analysis.percentage >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {analysis.percentage >= 70 ? "Excellent Approval Chances" : analysis.percentage >= 40 ? "Moderate Approval Chances" : "Needs Improvement"}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Based on your application data and AI analysis
                  </p>
                </div>

                {/* User Details */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold">Full Name</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{analysis.formData?.personalDetails?.firstName && analysis.formData?.personalDetails?.lastName ? `${analysis.formData.personalDetails.firstName} ${analysis.formData.personalDetails.lastName}` : analysis.formData?.personalDetails?.fullName || "Not Provided"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold">Email Address</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 break-all">{analysis.formData?.personalDetails?.email || analysis.email || "Not Provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">AI Predicted Success Rate</p>
                    <p className={`text-2xl font-bold ${analysis.percentage >= 70 ? 'text-green-500' : analysis.percentage >= 40 ? 'text-yellow-500' : 'text-red-500'} mt-1`}>{Math.round(analysis.percentage)}%</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Approval Status</p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
                      {analysis.percentage >= 70 ? "✓ Strong" : analysis.percentage >= 40 ? "⚠ Fair" : "✗ Weak"}
                    </p>
                  </div>
                </div>

                {/* Mobile Download PDF Button */}
                <button
                  onClick={handleDownloadPDF}
                  className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  <FiDownload size={18} />
                  Download PDF Report
                </button>
              </div>
            </div>

            {/* Reasoning Section */}
            <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-800/50 rounded-3xl shadow-lg border border-blue-100 dark:border-gray-700 p-8 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiAlertCircle className="text-white" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Reasoning
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Key factors that influenced the prediction
              </p>
              
              {analysis.reasoning && analysis.reasoning.length > 0 ? (
                <div className="space-y-3">
                  {analysis.reasoning.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-blue-100 dark:border-gray-600 hover:border-blue-300 dark:hover:border-gray-500 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getImpactIcon(item.impact)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {item.factor}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {item.description}
                        </p>
                        {item.weight !== undefined && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 max-w-[100px]">
                              <div
                                className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                style={{ width: `${item.weight * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Weight: {(item.weight * 100).toFixed(0)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No reasoning data available. SHAP/LIME analysis will be added here.
                </p>
              )}
            </div>

            {/* Improvements Section */}
            <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-800/50 rounded-3xl shadow-lg border border-blue-100 dark:border-gray-700 p-8 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiTrendingUp className="text-white" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Recommended Improvements
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Actions you can take to strengthen your visa application
              </p>
              
              {analysis.improvements && analysis.improvements.length > 0 ? (
                <div className="space-y-3">
                  {analysis.improvements.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-blue-100 dark:border-gray-600 hover:border-blue-300 dark:hover:border-gray-500 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {item.category}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                            item.priority
                          )}`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No improvements suggested at this time.
                </p>
              )}
            </div>

            {/* Back to Application Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate("/application")}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg hover:shadow-xl"
              >
                Create New Analysis
              </button>
            </div>
          </div>
        </main>

        {/* Sidebar - Analysis History */}
        <aside className={`fixed lg:sticky top-0 right-0 h-screen lg:h-[calc(100vh-73px)] w-80 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-800/50 border-l border-blue-100 dark:border-gray-700 overflow-y-auto transition-transform duration-300 z-30 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
              >
                ×
              </button>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex-1 text-right lg:text-left">Analysis History</h2>
            </div>
            
            {analyses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">No analyses yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {analyses.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      navigate(`/results/${item._id}`);
                      setSidebarOpen(false);
                    }}
                    className={`group p-3 rounded-lg cursor-pointer transition-all ${
                      analysis._id === item._id
                        ? "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 border border-blue-300 dark:border-blue-700 shadow-sm"
                        : "hover:bg-blue-50 dark:hover:bg-gray-700/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <FiClock className="text-gray-400 text-xs flex-shrink-0" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              item.percentage >= 70
                                ? "bg-green-500"
                                : item.percentage >= 40
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
