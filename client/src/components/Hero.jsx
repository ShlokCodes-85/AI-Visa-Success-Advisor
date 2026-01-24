import { useState } from "react";
import { MdDescription } from "react-icons/md";
import { IoChatbubblesOutline } from "react-icons/io5";
import AuthModal from "./AuthModal";

function Hero() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <section className="py-8 px-5 text-center">
      <h1 className="text-6xl font-bold mb-4">AI Visa Success Advisor</h1>
      <p className="text-lg text-gray-700 mb-6">Your intelligent partner for student visa success.</p>

      <div className="flex justify-center gap-4">
        <button 
          onClick={() => setShowAuth(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white border border-transparent shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:bg-white hover:text-blue-700 hover:border-blue-700 hover:bg-none flex items-center gap-2"
        >
          <MdDescription className="text-current text-xl" />
          Start with Form Mode
        </button>
        <button 
          onClick={() => setShowAuth(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white border border-transparent shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:bg-white hover:text-blue-700 hover:border-blue-700 hover:bg-none flex items-center gap-2"
        >
          <IoChatbubblesOutline className="text-current text-xl" />
          Start Interview Prep
        </button>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </section>
  );
}

export default Hero;
