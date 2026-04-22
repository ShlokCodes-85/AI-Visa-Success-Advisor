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
  const enableMocksEnv = import.meta.env.VITE_ENABLE_MOCKS === "true";
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const allowMocks = enableMocksEnv || isLocalhost;

  const mockAnalyses = [
    {
      _id: "mock-1",
      title: "STEM Masters - Canada",
      percentage: 78,
      email: "abhishek.chuttugulla@gmail.com",
      createdAt: new Date().toISOString(),
      formData: {
        personalDetails: {
          firstName: "Abhishek",
          lastName: "Chuttugulla",
          email: "abhishek.chuttugulla@gmail.com",
        },
      },
      reasoning: [
        {
          factor: "Strong Academic Record",
          impact: "positive",
          description: "Consistent GPA and research exposure align with program requirements.",
          weight: 0.3,
        },
        {
          factor: "Clear Study Plan",
          impact: "positive",
          description: "SOP clearly links program outcomes to career goals in India.",
          weight: 0.25,
        },
        {
          factor: "Financial Coverage",
          impact: "positive",
          description: "Savings and sponsor support cover tuition and living costs.",
          weight: 0.2,
        },
        {
          factor: "Limited Work Experience",
          impact: "negative",
          description: "Short industry exposure may reduce perceived practical readiness.",
          weight: 0.15,
        },
        {
          factor: "University Fit",
          impact: "positive",
          description: "Program ranking and faculty research match the applicant's interests.",
          weight: 0.1,
        },
        {
          factor: "Language Proficiency",
          impact: "neutral",
          description: "Overall score meets requirements but speaking is slightly below median.",
          weight: 0.08,
        },
      ],
      improvements: [
        {
          category: "Work Experience",
          suggestion: "Add internship letters highlighting relevant skills and responsibilities.",
          priority: "medium",
        },
        {
          category: "Home Country Ties",
          suggestion: "Include property documents and family business details.",
          priority: "high",
        },
        {
          category: "SOP",
          suggestion: "Add 2-3 measurable career milestones post-graduation.",
          priority: "low",
        },
        {
          category: "Language Proficiency",
          suggestion: "Add a speaking-focused mock test result or tutor feedback.",
          priority: "low",
        },
        {
          category: "Research Alignment",
          suggestion: "Mention 1-2 faculty labs and how your interests align.",
          priority: "medium",
        },
      ],
    },
    {
      _id: "mock-2",
      title: "Business Analytics - UK",
      percentage: 62,
      email: "bhumi.upade@gmail.com",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      formData: {
        personalDetails: {
          firstName: "Bhumi",
          lastName: "Upade",
          email: "bhumi.upade@gmail.com",
        },
      },
      reasoning: [
        {
          factor: "Academic Fit",
          impact: "positive",
          description: "Coursework aligns with analytics program prerequisites.",
          weight: 0.25,
        },
        {
          factor: "Funding Gap",
          impact: "negative",
          description: "Bank balance is slightly below recommended threshold.",
          weight: 0.25,
        },
        {
          factor: "Course Choice Justification",
          impact: "neutral",
          description: "SOP lacks specific modules and outcomes.",
          weight: 0.2,
        },
        {
          factor: "Work Experience Relevance",
          impact: "positive",
          description: "Analytics projects show basic tool proficiency and domain exposure.",
          weight: 0.15,
        },
        {
          factor: "Return Intent",
          impact: "neutral",
          description: "Post-study plan is present but missing employer linkage.",
          weight: 0.1,
        },
      ],
      improvements: [
        {
          category: "Financial Proof",
          suggestion: "Provide updated bank statements or sponsor affidavits.",
          priority: "high",
        },
        {
          category: "Program Fit",
          suggestion: "Reference 2-3 course modules relevant to your career plan.",
          priority: "medium",
        },
        {
          category: "Work Experience",
          suggestion: "Add a portfolio link or summary of analytics projects.",
          priority: "medium",
        },
        {
          category: "Home Country Ties",
          suggestion: "Include employer letter or offer indicating return intent.",
          priority: "high",
        },
      ],
    },
    {
      _id: "mock-3",
      title: "Undergrad Transfer - USA",
      percentage: 48,
      email: "harsh.rathod@gmail.com",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      formData: {
        personalDetails: {
          firstName: "Harsh",
          lastName: "Rathod",
          email: "harsh.rathod@gmail.com",
        },
      },
      reasoning: [
        {
          factor: "Academic Consistency",
          impact: "negative",
          description: "Recent transcripts show multiple gaps in coursework.",
          weight: 0.3,
        },
        {
          factor: "SOP Clarity",
          impact: "negative",
          description: "Motivation for transfer is vague and lacks specifics.",
          weight: 0.25,
        },
        {
          factor: "Financial Support",
          impact: "neutral",
          description: "Funding details are present but incomplete.",
          weight: 0.15,
        },
        {
          factor: "Transfer Rationale",
          impact: "negative",
          description: "Limited evidence of academic progression at current institution.",
          weight: 0.12,
        },
        {
          factor: "Extracurriculars",
          impact: "positive",
          description: "Strong community involvement shows leadership potential.",
          weight: 0.08,
        },
      ],
      improvements: [
        {
          category: "Academic Records",
          suggestion: "Include official transcripts and explain any gaps clearly.",
          priority: "high",
        },
        {
          category: "SOP",
          suggestion: "Clarify reasons for transfer and highlight academic goals.",
          priority: "high",
        },
        {
          category: "Financial Proof",
          suggestion: "Add sponsor income documents and tuition payment plan.",
          priority: "medium",
        },
        {
          category: "Transfer Plan",
          suggestion: "Map equivalent courses and show how credits will transfer.",
          priority: "medium",
        },
        {
          category: "Academic Consistency",
          suggestion: "Add a short addendum explaining any academic gaps.",
          priority: "high",
        },
      ],
    },
  ];

  const applyMockAnalyses = (preferredId) => {
    setAnalyses(mockAnalyses);
    const selected = mockAnalyses.find((item) => item._id === preferredId) || mockAnalyses[0];
    setAnalysis(selected);
  };

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

      // Check if this is a mock analysis ID
      const isMockId = analysisId && analysisId.startsWith("mock-");

      if (isMockId && !token && allowMocks) {
        applyMockAnalyses(analysisId);
        setLoading(false);
        return;
      }

      // If no token, fall back to dummy data for preview mode
      if (!token) {
        if (allowMocks) {
          setAnalyses(mockAnalyses);
          if (!analysisId) {
            navigate(`/results/${mockAnalyses[0]._id}`);
          }
        }
        setLoading(false);
        return;
      }

      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        
        if (analysisId && !isMockId) {
          // Fetch specific analysis from MongoDB
          const response = await fetch(`${BACKEND_URL}/api/analyses/${analysisId}?_t=${Date.now()}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
            cache: "no-store",
          });

          if (response.ok) {
            const data = await response.json();
            setAnalysis(data.analysis);
          } else if (response.status === 404) {
            console.error("Analysis not found");
            navigate("/results");
          } else {
            throw new Error(`Failed to fetch analysis: ${response.statusText}`);
          }
        }
      } catch (error) {
        console.error("Error fetching analysis:", error);
        // Only fall back to mock data if mocks are allowed AND it's a mock ID
        if (isMockId && allowMocks) {
          applyMockAnalyses(analysisId);
        } else {
          navigate("/results");
        }
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
      if (!token) {
        // Only show mock data when mocks are allowed and no token
        if (allowMocks) {
          setAnalyses(mockAnalyses);
          if (!analysisId) {
            navigate(`/results/${mockAnalyses[0]._id}`);
          }
        }
        return;
      }

      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${BACKEND_URL}/api/analyses?_t=${Date.now()}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (response.status === 204) {
          console.warn("[RESULTS] API returned 204 No Content for /api/analyses");
          setAnalyses([]);
          return;
        }

        if (response.ok) {
          const data = await response.json();
            console.log("[RESULTS] API Response:", data);
            console.log("[RESULTS] Analyses array:", data.analyses);
            console.log("[RESULTS] Number of analyses:", data.analyses?.length || 0);
          
            if (data.analyses && data.analyses.length > 0) {
            setAnalyses(data.analyses);

            // If no specific analysis is loaded, load the latest one
            if (!analysisId) {
              navigate(`/results/${data.analyses[0]._id}`);
            }
          } else {
            // Empty result from API (user has no analyses yet)
            console.log("No analyses found for user");
              console.log("[RESULTS] Full API response when empty:", JSON.stringify(data));
            setAnalyses([]);
          }
        } else {
            console.error("[RESULTS] API returned non-OK status:", response.status, response.statusText);
          throw new Error(`Failed to fetch analyses: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching analyses:", error);
        // Only fallback to mock when mocks are allowed and there's an error
        if (allowMocks) {
          setAnalyses(mockAnalyses);
          if (!analysisId) {
            navigate(`/results/${mockAnalyses[0]._id}`);
          }
        }
      }
    };

    fetchAnalyses();
  }, [analysisId, navigate]);

  const handleDownloadPDF = () => {
    if (!analysis) {
      alert("No analysis data available to download");
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 14;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = 20;

      // Header with branding
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text('AI Visa Success Advisor', pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text('Comprehensive Analysis Report', pageWidth / 2, 30, { align: 'center' });

      yPosition = 50;

      // User Information Section with Percentage Circle
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('Applicant Information', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      // Prioritize real form input data over mock/OAuth data
      const userName = analysis.formData?.fullName || ((analysis.formData?.personalDetails?.firstName && analysis.formData?.personalDetails?.lastName) ? `${analysis.formData.personalDetails.firstName} ${analysis.formData.personalDetails.lastName}`.trim() : "Not Provided");
      const userEmail = analysis.formData?.contactEmail || analysis.formData?.personalDetails?.email || analysis.email || "Not Provided";
      const analysisDate = new Date(analysis.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });
      const percentage = analysis.percentage;
      const statusColor = percentage >= 70 ? [16, 185, 129] : percentage >= 40 ? [234, 179, 8] : [239, 68, 68];

      // User info on the left
      const infoLeftX = margin;
      const circleRightX = pageWidth - margin - 25;
      const circleTopY = yPosition - 2;

      doc.text(`Name: ${userName}`, infoLeftX, yPosition);
      yPosition += 7;
      doc.text(`Email: ${userEmail}`, infoLeftX, yPosition);
      yPosition += 7;
      doc.text(`Analysis Date: ${analysisDate}`, infoLeftX, yPosition);

      // Draw circular percentage indicator on the right
      const circleRadius = 12;
      const circleCenterX = circleRightX;
      const circleCenterY = circleTopY + circleRadius;

      // Outer circle background
      doc.setFillColor(220, 220, 220);
      doc.circle(circleCenterX, circleCenterY, circleRadius, 'F');

      // Colored inner circle
      doc.setFillColor(...statusColor);
      doc.circle(circleCenterX, circleCenterY, circleRadius - 2, 'F');

      // Percentage text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(`${percentage}%`, circleCenterX, circleCenterY + 1, { align: 'center' });

      yPosition += 15;

      // Status text below user info
      const statusText = percentage >= 70 ? "Excellent Approval Chances" : percentage >= 40 ? "Moderate Approval Chances" : "Needs Improvement";
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(...statusColor);
      doc.text(`Status: ${statusText}`, margin, yPosition);
      yPosition += 12;

      // AI Reasoning Section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('AI Reasoning & Key Factors', margin, yPosition);
      yPosition += 10;

      if (analysis.reasoning && analysis.reasoning.length > 0) {
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        analysis.reasoning.forEach((item, index) => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = 20;
          }
          
          const impact = item.impact.charAt(0).toUpperCase() + item.impact.slice(1);
          const weight = item.weight ? `${(item.weight * 100).toFixed(0)}%` : 'N/A';
          
          doc.setFont(undefined, 'bold');
          doc.text(`${index + 1}. ${item.factor}`, margin, yPosition);
          yPosition += 5;
          
          doc.setFont(undefined, 'normal');
          doc.setFontSize(8);
          doc.text(`Impact: ${impact} | Weight: ${weight}`, margin + 5, yPosition);
          yPosition += 4;
          
          const wrappedDescription = doc.splitTextToSize(item.description, contentWidth - 10);
          doc.text(wrappedDescription, margin + 5, yPosition);
          yPosition += wrappedDescription.length * 4 + 5;
          
          doc.setFontSize(9);
        });
      } else {
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text('No reasoning data available.', margin, yPosition);
        yPosition += 10;
      }

      yPosition += 5;

      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      // Recommended Improvements Section
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('Recommended Improvements', margin, yPosition);
      yPosition += 10;

      if (analysis.improvements && analysis.improvements.length > 0) {
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        analysis.improvements.forEach((item, index) => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = 20;
          }
          
          const priority = item.priority.charAt(0).toUpperCase() + item.priority.slice(1);
          
          doc.setFont(undefined, 'bold');
          doc.text(`${index + 1}. ${item.category}`, margin, yPosition);
          yPosition += 5;
          
          doc.setFont(undefined, 'normal');
          doc.setFontSize(8);
          doc.text(`Priority: ${priority}`, margin + 5, yPosition);
          yPosition += 4;
          
          const wrappedSuggestion = doc.splitTextToSize(item.suggestion, contentWidth - 10);
          doc.text(wrappedSuggestion, margin + 5, yPosition);
          yPosition += wrappedSuggestion.length * 4 + 5;
          
          doc.setFontSize(9);
        });
      } else {
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text('No improvements suggested at this time.', margin, yPosition);
        yPosition += 10;
      }

      // Footer
      const footerY = pageHeight - 15;
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.setFont(undefined, 'italic');
      doc.text('Generated by AI Visa Success Advisor - This analysis is for informational purposes only.', pageWidth / 2, footerY, { align: 'center' });

      // Save the PDF
      const fileName = `Visa_Analysis_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF: " + error.message);
    }
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
                  userName={analysis.formData?.fullName || ((analysis.formData?.personalDetails?.firstName && analysis.formData?.personalDetails?.lastName) ? `${analysis.formData.personalDetails.firstName} ${analysis.formData.personalDetails.lastName}` : "User")}
                  userEmail={analysis.formData?.contactEmail || analysis.formData?.personalDetails?.email || analysis.email || "user@example.com"}
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
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{analysis.formData?.fullName || ((analysis.formData?.personalDetails?.firstName && analysis.formData?.personalDetails?.lastName) ? `${analysis.formData.personalDetails.firstName} ${analysis.formData.personalDetails.lastName}` : "Not Provided")}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold">Email Address</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 break-all">{analysis.formData?.contactEmail || analysis.formData?.personalDetails?.email || analysis.email || "Not Provided"}</p>
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
