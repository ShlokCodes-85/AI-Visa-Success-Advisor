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
  const [pendingDeleteChat, setPendingDeleteChat] = useState(null);

  const handleCreateNewChat = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to create a chat");
      return;
    }

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: `New Chat`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newChat = {
          id: data.chat.id,
          title: data.chat.title,
          createdAt: data.chat.createdAt,
        };
        setChats([newChat, ...chats]);
        setActiveChat(newChat.id);
        console.log("Chat created successfully:", newChat.id);
      } else {
        console.error("Failed to create chat:", response.status);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Failed to create chat");
    }
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    const chat = chats.find((item) => item.id === chatId) || null;
    setPendingDeleteChat(chat);
  };

  const confirmDeleteChat = async () => {
    if (!pendingDeleteChat) return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to delete a chat");
      return;
    }

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/chats/${pendingDeleteChat.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedChats = chats.filter((chat) => chat.id !== pendingDeleteChat.id);
        setChats(updatedChats);

        if (activeChat === pendingDeleteChat.id) {
          setActiveChat(null);
        }

        setPendingDeleteChat(null);
        console.log("Chat deleted successfully");
      } else {
        console.error("Failed to delete chat:", response.status);
        alert("Failed to delete chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat");
    }
  };

  const cancelDeleteChat = () => {
    setPendingDeleteChat(null);
  };

  const handleEditChat = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = async (chatId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to update chat title");
      return;
    }

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/chats/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
        }),
      });

      if (response.ok) {
        setChats(
          chats.map((chat) =>
            chat.id === chatId ? { ...chat, title: editTitle } : chat
          )
        );
        setEditingId(null);
        setEditTitle("");
        console.log("Chat title updated successfully");
      } else {
        console.error("Failed to update chat title:", response.status);
        alert("Failed to update chat title");
      }
    } catch (error) {
      console.error("Error updating chat title:", error);
      alert("Failed to update chat title");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };



  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-2 sm:p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {/* New Chat Button */}
        <button
          onClick={handleCreateNewChat}
          className="w-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 bg-blue-400 text-white rounded-3xl hover:bg-blue-500 transition-colors font-medium shadow-sm text-xs sm:text-sm min-h-[44px] sm:min-h-[auto]"
        >
          <FiPlus className="text-base" />
          <span className="hidden xs:inline">New Chat</span>
          <span className="inline xs:hidden">New</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-1.5 sm:p-2 space-y-1 sm:space-y-1.5">
        {chats.length === 0 ? (
          <div className="flex items-center justify-center h-full px-2 sm:px-4">
            <div className="text-center">
              <FiMessageSquare className="text-3xl sm:text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-2 sm:mb-4" />
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">No Chats Yet</h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-2 sm:mb-4">Start a conversation with your AI Visa Advisor</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Click "New Chat" above to begin</p>
            </div>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`group relative p-2 rounded-lg cursor-pointer transition-all text-xs sm:text-sm ${
                activeChat === chat.id
                  ? "bg-white dark:bg-gray-800 shadow-sm border border-indigo-200 dark:border-indigo-400"
                  : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              }`}
            >
              {editingId === chat.id ? (
                <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-2 py-1 text-xs border bg-white dark:bg-gray-700 text-black dark:text-gray-100 border-transparent dark:border-gray-600 rounded focus:outline-none focus:ring-2"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(chat.id);
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSaveEdit(chat.id)}
                      className="px-2 py-0.5 text-[11px] bg-blue-400 text-white rounded hover:bg-blue-600 min-h-[32px]"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-2 py-0.5 text-[11px] bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 min-h-[32px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-1 sm:gap-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1 flex-1 text-xs sm:text-sm">
                    {chat.title}
                  </h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={(e) => handleEditChat(chat, e)}
                      className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Edit chat"
                    >
                      <FiEdit2 className="text-xs" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="bg-white dark:bg-gray-800 text-red-600 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Delete chat"
                    >
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {pendingDeleteChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-xl">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Delete chat?</h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              This will permanently delete "{pendingDeleteChat.title}" and its messages.
            </p>
            <div className="mt-4 sm:mt-5 flex justify-end gap-2">
              <button
                onClick={cancelDeleteChat}
                className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[40px] sm:min-h-[auto]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteChat}
                className="px-3 py-2 text-xs sm:text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 min-h-[40px] sm:min-h-[auto]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
