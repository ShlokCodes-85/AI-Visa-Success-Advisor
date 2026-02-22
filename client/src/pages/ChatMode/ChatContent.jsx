import { useMemo, useState } from "react";
import { FiSend, FiPlus } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { useApplicationContext } from "../../contexts/ApplicationContext";

export default function ChatContent({
  activeChat = null,
  chats = [],
  messagesByChat = {},
  setMessagesByChat = () => {},
}) {
  const { applicationData } = useApplicationContext();
  const [inputMessage, setInputMessage] = useState("");
  const [attachmentsByChat, setAttachmentsByChat] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const messages = useMemo(() => {
    if (!activeChat) return [];
    return messagesByChat[activeChat] || [];
  }, [activeChat, messagesByChat]);

  const attachments = useMemo(() => {
    if (!activeChat) return [];
    return attachmentsByChat[activeChat] || [];
  }, [activeChat, attachmentsByChat]);

  // Get current chat name
  const currentChatName = chats.find(chat => chat.id === activeChat)?.title || "Select a chat";

  const persistMessage = async (role, content) => {
    const token = localStorage.getItem("token");
    if (!token || !activeChat) return;

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${BACKEND_URL}/api/chats/${activeChat}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ role, content }),
      });

      if (!response.ok) {
        console.error("Failed to persist message:", response.status);
      }
    } catch (error) {
      console.error("Error persisting message:", error);
    }
  };
  
  // Helper function to read file contents
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          let content = e.target.result;
          
          // For text-based files, keep as is
          if (file.type.includes('text') || file.name.endsWith('.txt')) {
            content = e.target.result;
          }
          // For other types, just note the file was uploaded
          else {
            content = `[File: ${file.name} (${file.type || 'binary'}) - Size: ${file.size} bytes]\n(Binary file content cannot be directly read in browser, but the file was uploaded)`;
          }
          
          resolve({
            name: file.name,
            content: content,
            type: file.type,
            size: file.size,
          });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (e) => reject(e);
      
      // For text files, read as text
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        // For other files, read as data URL (will capture file info)
        reader.readAsDataURL(file);
      }
    });
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    
    // IMPORTANT: Capture attachments BEFORE any state updates
    const currentAttachments = attachmentsByChat[activeChat] || [];
    console.log("Captured attachments from state:", currentAttachments);
    
    const newMessage = {
      id: Date.now(),
      type: "user",
      text: userMessage,
      timestamp: new Date(),
    };

    setMessagesByChat((prev) => {
      const current = prev[activeChat] || [];
      return {
        ...prev,
        [activeChat]: [...current, newMessage],
      };
    });
    persistMessage("user", userMessage);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Read attached file contents BEFORE any state changes
      const documentData = [];
      
      if (currentAttachments.length > 0) {
        console.log("Processing", currentAttachments.length, "file(s)...");
        for (const file of currentAttachments) {
          try {
            console.log("Reading file:", file.name, "Type:", file.type, "Size:", file.size);
            const fileContent = await readFileContent(file);
            console.log("Successfully read file:", fileContent.name, "Content length:", fileContent.content.length);
            documentData.push(fileContent);
          } catch (fileError) {
            console.error(`Failed to read file ${file.name}:`, fileError);
          }
        }
      } else {
        console.log("No attachments found for chat", activeChat);
      }

      // Call AI backend API
      const token = localStorage.getItem("token");
      const requestBody = { 
        message: userMessage,
        documents: documentData.length > 0 ? documentData : null,
        applicationData: applicationData || null,
      };
      
      console.log("Request body:", {
        message: userMessage,
        documentsCount: documentData.length,
        documentNames: documentData.map(d => d.name),
        hasApplicationData: !!applicationData,
      });
      
      // TODO: Update with Python backend URL when deployed
      const response = await fetch(`http://localhost:8000/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Chat-Id": activeChat.toString(),
          "X-User-Id": token || "anonymous",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.detail || `HTTP error ${response.status}`);
      }

      if (data.success && data.response) {
        const botResponse = {
          id: Date.now() + 1,
          type: "bot",
          text: data.response,
          timestamp: new Date(),
        };
        setMessagesByChat((prev) => {
          const current = prev[activeChat] || [];
          return {
            ...prev,
            [activeChat]: [...current, botResponse],
          };
        });
        persistMessage("assistant", data.response);
        
        // Clear attachments after successful send
        console.log("Clearing attachments for chat:", activeChat);
        setAttachmentsByChat((prev) => {
          const updated = { ...prev };
          delete updated[activeChat];
          return updated;
        });
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Check if it's a quota error
      let errorMessage = "Sorry, I encountered an error. Please try again.";
      if (error.message && error.message.includes("quota")) {
        errorMessage = "⚠️ API quota exceeded. The free tier has a daily limit. Please try again later or consider upgrading your plan.";
      } else if (error.message && error.message.includes("429")) {
        errorMessage = "⚠️ Too many requests. Please wait a moment and try again.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      const errorResponse = {
        id: Date.now() + 1,
        type: "bot",
        text: errorMessage,
        timestamp: new Date(),
      };
      setMessagesByChat((prev) => {
        const current = prev[activeChat] || [];
        return {
          ...prev,
          [activeChat]: [...current, errorResponse],
        };
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !activeChat) return;

    setAttachmentsByChat((prev) => {
      const current = prev[activeChat] || [];
      return {
        ...prev,
        [activeChat]: [...current, ...files],
      };
    });

    e.target.value = "";
  };

  return (
    <div className="h-full px-2 sm:px-3 py-3 sm:py-4">
      {!activeChat ? (
        // Empty State - No Chat Selected
        <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full items-center justify-center p-4 sm:p-6">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">Chat with the Advisor</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Get expert guidance on your visa application journey</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Create a new chat to start a conversation with our AI advisor</p>
          </div>
        </div>
      ) : (
        // Active Chat Interface
        <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
          {/* Chat Header */}
          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{currentChatName}</h2>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] xs:max-w-[75%] sm:max-w-[70%] rounded-lg sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs xs:text-sm ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  }`}
                >
                  {message.type === "user" ? (
                    <p>{message.text}</p>
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-base prose-p:text-xs prose-p:mb-1 prose-ul:text-xs prose-li:mb-0">
                      <ReactMarkdown
                        components={{
                          p: (props) => <p className="mb-1 last:mb-0" {...props} />,
                          ul: (props) => <ul className="list-disc list-inside mb-1" {...props} />,
                          ol: (props) => <ol className="list-decimal list-inside mb-1" {...props} />,
                          li: (props) => <li className="mb-0.5" {...props} />,
                          strong: (props) => <strong className="font-bold" {...props} />,
                          em: (props) => <em className="italic" {...props} />,
                          h1: (props) => <h1 className="text-sm font-bold mb-1" {...props} />,
                          h2: (props) => <h2 className="text-xs font-bold mb-1" {...props} />,
                          h3: (props) => <h3 className="text-xs font-bold mb-1" {...props} />,
                          blockquote: (props) => <blockquote className="border-l-4 border-gray-400 dark:border-gray-600 pl-2 italic mb-1" {...props} />,
                          code: (props) => <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-[10px]" {...props} />,
                          table: (props) => <table className="border-collapse border border-gray-400 dark:border-gray-600 text-[10px] mb-1" {...props} />,
                          tr: (props) => <tr className="border border-gray-400 dark:border-gray-600" {...props} />,
                          td: (props) => <td className="border border-gray-400 dark:border-gray-600 px-1 py-0.5" {...props} />,
                          th: (props) => <th className="border border-gray-400 dark:border-gray-600 px-1 py-0.5 bg-gray-200 dark:bg-gray-700 font-bold" {...props} />,
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] sm:max-w-[70%] rounded-lg sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="px-2 sm:px-4 py-2 sm:py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            {attachments.length > 0 && (
              <div className="mb-2 space-y-1">
                {attachments.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1"
                  >
                    {file.name}
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3 items-center">
              <label className="cursor-pointer p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors flex-shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center" title="Attach document">
                <FiPlus className="text-lg text-white" />
                <input
                  type="file"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  multiple
                />
              </label>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type message..."
                disabled={isLoading}
                className="flex-1 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-gray-100 border border-transparent dark:border-gray-700 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-500 dark:placeholder-gray-400 text-sm min-h-[40px]"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-3 sm:px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all flex items-center gap-1 sm:gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 min-h-[40px] text-xs sm:text-sm"
              >
                <FiSend className="text-base" />
                <span className="hidden xs:inline">{isLoading ? "Sending..." : "Send"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
