import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Send message to AI and get response
router.post("/message", protect, async (req, res) => {
  try {
    // Initialize Gemini client inside the handler to ensure env vars are loaded
    if (!process.env.GEMINI_API_KEY) {
      console.error("[AI CHAT] GEMINI_API_KEY not found in environment variables");
      return res.status(500).json({ 
        success: false,
        error: "Gemini API key is not configured. Please set GEMINI_API_KEY environment variable." 
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    console.log("[AI CHAT] Route hit - processing message");
    console.log("[AI CHAT] User:", req.user);
    console.log("[AI CHAT] Request body:", req.body);
    
    const { message, documents, applicationData } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ 
        success: false,
        error: "Message cannot be empty" 
      });
    }

    console.log(`[AI CHAT] User ${req.user.id} sending message. Has documents: ${!!documents}, Has app data: ${!!applicationData}`);

    // Build context for AI
    let systemContext = `You are an expert Student Visa Success Advisor with extensive knowledge of international student visa applications, university admissions, and immigration processes worldwide.

Your role is to:
- Help students understand visa requirements for studying abroad
- Guide them through the application process step by step
- Review their documents and provide feedback
- Assess their visa application strength and success probability
- Provide tips for visa interviews
- Explain financial proof requirements
- Advise on Statement of Purpose (SOP) and other application documents
- Answer questions about specific country visa processes (USA F-1, UK Student Visa, Canada Study Permit, Australia Student Visa, etc.)

Be professional, empathetic, encouraging, and thorough. Provide specific, actionable advice. When reviewing documents or application data, give detailed feedback and suggestions for improvement.`;

    // Add application data context if available
    if (applicationData) {
      systemContext += `\n\nUser's Application Context:\n${JSON.stringify(applicationData, null, 2)}`;
    }

    // Add document context if available
    let documentAnalysisPrompt = "";
    if (documents && documents.length > 0) {
      systemContext += `\n\n## IMPORTANT: The user has uploaded ${documents.length} document(s) for your analysis. Please carefully review each document and provide specific feedback.`;
      
      documentAnalysisPrompt += `\n\n📄 UPLOADED DOCUMENTS FOR ANALYSIS:\n`;
      documents.forEach((doc, index) => {
        documentAnalysisPrompt += `\n--- Document ${index + 1}: ${doc.name} ---\n`;
        if (doc.content) {
          documentAnalysisPrompt += `${doc.content}\n`;
          documentAnalysisPrompt += `--- End of ${doc.name} ---\n`;
        } else {
          documentAnalysisPrompt += `[Document metadata only - ${doc.type || 'unknown type'}, ${doc.size || 'unknown size'} bytes]\n`;
        }
      });
      
      systemContext += `\n\nWhen analyzing documents, provide:
1. Overall assessment and strengths
2. Areas for improvement with specific suggestions
3. Compliance with visa/university requirements
4. Language, tone, and structure feedback
5. Specific recommendations for revisions`;
    }

    // Combine system context with user message and documents
    const fullPrompt = `${systemContext}\n${documentAnalysisPrompt}\n\nUser Question: ${message}\n\nProvide a comprehensive response addressing the user's question${documents && documents.length > 0 ? ' and analyzing the uploaded documents in detail' : ''}.`;

    console.log("[AI CHAT] Full prompt length:", fullPrompt.length);
    const rawModel = process.env.CHAT_LLM_MODEL || "gemini-2.5-flash";
    const preferredModel = rawModel.startsWith("models/") ? rawModel.replace("models/", "") : rawModel;
    console.log("[AI CHAT] Model:", preferredModel);

    // Get Gemini model
    const model = genAI.getGenerativeModel({
      model: preferredModel
    });

    console.log("[AI CHAT] Model initialized, calling generateContent...");

    // Generate response with fallback for older model support
    let result;
    try {
      result = await model.generateContent(fullPrompt);
    } catch (modelError) {
      if (modelError?.message?.includes("not found") || modelError?.message?.includes("not supported")) {
        const fallbackModel = "gemini-2.0-flash";
        console.warn(`[AI CHAT] Model ${preferredModel} not available. Falling back to ${fallbackModel}.`);
        const fallback = genAI.getGenerativeModel({ model: fallbackModel });
        result = await fallback.generateContent(fullPrompt);
      } else {
        throw modelError;
      }
    }
    console.log("[AI CHAT] Got result from generateContent");
    
    const response = await result.response;
    console.log("[AI CHAT] Got response object");
    
    const aiResponse = response.text();
    console.log("[AI CHAT] Got text from response, length:", aiResponse.length);

    console.log(`[AI CHAT] Generated response for user ${req.user.id}`);

    res.json({
      success: true,
      response: aiResponse,
      chat_id: req.headers["x-chat-id"],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AI CHAT ERROR] Caught error:", error);
    console.error("[AI CHAT ERROR] Error type:", error.constructor.name);
    console.error("[AI CHAT ERROR] Error message:", error.message);
    
    if (error.message?.includes("API key") || error.message?.includes("API_KEY") || error.message?.includes("401")) {
      console.error("[AI CHAT ERROR] API key issue detected");
      return res.status(500).json({ 
        success: false,
        error: "Gemini API key is invalid or missing. Please configure GEMINI_API_KEY." 
      });
    }

    if (error.message?.includes("Resource")) {
      console.error("[AI CHAT ERROR] Resource error - possibly blocked request");
      return res.status(500).json({
        success: false,
        error: "Request was blocked or resource not available. This may be a safety filter issue."
      });
    }
    
    console.error("[AI CHAT ERROR] Error stack:", error.stack);
    res.status(500).json({ 
      success: false,
      error: `Error processing message: ${error.message || 'Unknown error'}` 
    });
  }
});

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "AI Chat Service",
    provider: "Google Gemini",
  });
});

export default router;
