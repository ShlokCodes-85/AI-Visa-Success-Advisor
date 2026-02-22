import { useState } from "react";
import useLazyLoad from '../hooks/useLazyLoad';

function HowItWorks() {
  const { elementRef, isVisible } = useLazyLoad();
  const [mode, setMode] = useState("form");

  return (
    <section ref={elementRef} id="how-it-works" className="py-8 sm:py-10 lg:py-12 pb-8 sm:pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease-in' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 lg:mb-10 text-center px-2 sm:px-0">
          How It Works
        </h2>

        <div className="flex justify-center gap-6 sm:gap-10 mb-6 sm:mb-8 lg:mb-10 flex-wrap px-2 sm:px-0">
          {[
            { key: "chat", label: "Chat Mode" },
            { key: "form", label: "Form Mode" }
          ].map((item) => {
            const active = mode === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setMode(item.key)}
                className={`relative pb-2 text-base sm:text-lg lg:text-xl font-semibold transition-colors duration-200 bg-transparent border-0 outline-none focus:outline-none hover:outline-none active:outline-none min-h-[44px] ${
                  active ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                }`}
                style={{ border: "none", boxShadow: "none" }}
              >
                {item.label}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -bottom-1 h-[3px] w-12 rounded-full transition-all duration-200 ${
                    active ? "bg-black dark:bg-white" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {mode === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
            <div className="w-full h-48 xs:h-56 sm:h-64 lg:h-72 bg-gray-100 dark:bg-gray-700 border border-dashed border-transparent dark:border-gray-600 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              <video
                src="/chat_mode.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-48 xs:h-56 sm:h-64 lg:h-72 rounded-xl border border-gray-200 dark:border-gray-700 object-cover bg-black"
              />
            </div>
            <div className="space-y-2 sm:space-y-3 text-gray-700 dark:text-gray-300 px-2 sm:px-0">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white">Chat Mode</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                Your visa coach answers doubts instantly, practices interview questions, and guides documents with AI-powered prompts tailored to your profile.
              </p>
              <p className="text-sm sm:text-base leading-relaxed">
                Upload docs, ask follow-ups, and get concise action items so you know exactly what to fix before your interview.
              </p>
            </div>
          </div>
        )}

        {mode === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
            <div className="order-2 lg:order-1 space-y-2 sm:space-y-3 text-gray-700 dark:text-gray-300 px-2 sm:px-0">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white">Form Mode</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                Complete every visa form with smart hints, auto-checks, and a real-time readiness score so you submit confidently.
              </p>
              <p className="text-sm sm:text-base leading-relaxed">
                The checklist highlights gaps—financial proof, ties to home, academics—so you can resolve them before filing.
              </p>
            </div>
            <div className="order-1 lg:order-2 w-full">
              <video
                src="/form_mode.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-48 xs:h-56 sm:h-64 lg:h-72 rounded-xl border border-gray-200 dark:border-gray-700 object-cover bg-black"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default HowItWorks;
