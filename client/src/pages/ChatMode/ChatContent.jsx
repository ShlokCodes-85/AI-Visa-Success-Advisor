import { useState } from "react";
import { FiSend, FiPlus } from "react-icons/fi";

export default function ChatContent({ activeChat = null, chats = [] }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  // Get current chat name
  const currentChatName = chats.find(chat => chat.id === activeChat)?.title || "Select a chat";
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        text: "Thank you for your message. I'm processing your request...",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Handle document upload logic here
    console.log("Document uploaded:", file.name);
  };

  return (
    <div className="h-full px-6 py-8">
      {!activeChat ? (
        // Empty State - No Chat Selected
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Chat with the Advisor</h2>
            <p className="text-gray-600 text-lg mb-2">Get expert guidance on your visa application journey</p>
            <p className="text-gray-500 text-base">Create a new chat to start a conversation with our AI advisor</p>
          </div>
        </div>
      ) : (
        // Active Chat Interface
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{currentChatName}</h2>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="px-6 py-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
              <label className="cursor-pointer p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors" title="Attach document">
                <FiPlus className="text-lg text-white" />
                <input
                  type="file"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                />
              </label>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 px-4 py-3 bg-white text-black border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all flex items-center gap-2 font-medium"
              >
                <FiSend className="text-lg" />
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
