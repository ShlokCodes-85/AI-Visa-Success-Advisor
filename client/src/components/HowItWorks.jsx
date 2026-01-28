import { useState } from "react";
import useLazyLoad from '../hooks/useLazyLoad';

function HowItWorks() {
  const { elementRef, isVisible } = useLazyLoad();
  const [mode, setMode] = useState("form");

  return (
    <section ref={elementRef} id="how-it-works" className="py-16 px-5 bg-white" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease-in' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10 text-center">
          How It Works
        </h2>

        <div className="flex justify-center gap-10 mb-10">
          {[
            { key: "chat", label: "Chat Mode" },
            { key: "form", label: "Form Mode" }
          ].map((item) => {
            const active = mode === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setMode(item.key)}
                className={`relative pb-2 text-lg font-semibold transition-colors duration-200 bg-transparent border-0 outline-none focus:outline-none hover:outline-none active:outline-none ${
                  active ? "text-gray-900" : "text-gray-500"
                }`}
                style={{ border: "none", boxShadow: "none" }}
              >
                {item.label}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -bottom-1 h-[3px] w-12 rounded-full transition-all duration-200 ${
                    active ? "bg-black" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {mode === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="w-full h-72 bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500">
              Video placeholder (Chat Mode)
            </div>
            <div className="space-y-3 text-gray-700">
              <h3 className="text-2xl font-semibold text-gray-900">Chat Mode</h3>
              <p>
                Your visa coach answers doubts instantly, practices interview questions, and guides documents with AI-powered prompts tailored to your profile.
              </p>
              <p>
                Upload docs, ask follow-ups, and get concise action items so you know exactly what to fix before your interview.
              </p>
            </div>
          </div>
        )}

        {mode === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1 space-y-3 text-gray-700">
              <h3 className="text-2xl font-semibold text-gray-900">Form Mode</h3>
              <p>
                Complete every visa form with smart hints, auto-checks, and a real-time readiness score so you submit confidently.
              </p>
              <p>
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
                className="w-full h-72 rounded-xl border border-gray-200 object-cover bg-black"
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
