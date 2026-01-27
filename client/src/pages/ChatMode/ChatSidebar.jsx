import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiMessageSquare } from "react-icons/fi";

export default function ChatSidebar({
  chats = [],
  setChats = () => {},
  activeChat = null,
  setActiveChat = () => {},
  editingId = null,
  setEditingId = () => {},
  editTitle = "",
  setEditTitle = () => {},
}) {

  const handleCreateNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `New Chat`,
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat?")) {
      const updatedChats = chats.filter((chat) => chat.id !== chatId);
      setChats(updatedChats);
      
      // Always clear activeChat when a chat is deleted
      // User must select another chat or create a new one to continue
      if (activeChat === chatId) {
        setActiveChat(null);
      }
    }
  };

  const handleEditChat = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = (chatId) => {
    setChats(
      chats.map((chat) =>
        chat.id === chatId ? { ...chat, title: editTitle } : chat
      )
    );
    setEditingId(null);
    setEditTitle("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };



  return (
    <div className="h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <button
          onClick={handleCreateNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-3xl hover:bg-blue-500 transition-colors font-medium shadow-sm"
        >
          <FiPlus className="text-lg" />
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {chats.length === 0 ? (
          <div className="flex items-center justify-center h-full px-4">
            <div className="text-center">
              <FiMessageSquare className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Chats Yet</h3>
              <p className="text-gray-600 text-sm mb-4">Start a conversation with your AI Visa Advisor</p>
              <p className="text-gray-500 text-xs">Click "New Chat" above to begin</p>
            </div>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                activeChat === chat.id
                  ? "bg-white shadow-sm border border-indigo-200"
                  : "bg-white hover:bg-gray-50 border border-transparent hover:border-gray-200"
              }`}
            >
              {editingId === chat.id ? (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-2 py-1 text-sm border bg-white text-black border-gray-300 rounded focus:outline-none focus:ring-2"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(chat.id);
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSaveEdit(chat.id)}
                      className="px-2 py-0.5 text-xs bg-blue-400 text-white rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-1 flex-1">
                    {chat.title}
                  </h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditChat(chat, e)}
                      className="bg-white text-gray-600"
                      title="Edit chat"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="bg-white text-red-600"
                      title="Delete chat"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
