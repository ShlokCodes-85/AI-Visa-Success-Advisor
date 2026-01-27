import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

function FAQ() {
  const faqs = [
    {
      q: "How does the AI personalize my visa plan?",
      a: "Form Mode captures your academics, finances, and home ties, then generates a readiness score plus a tailored checklist so you know exactly what to fix before filing."
    },
    {
      q: "Can I get quick answers to my visa questions?",
      a: "Yes. Chat Mode gives concise, context-aware answers about your documents, timelines, and next steps so you stay unblocked."
    },
    {
      q: "What if I have documents to upload or gaps to fix?",
      a: "The checklist flags missing financial proof, SOP clarity, and home-ties evidence. You get action items and can iterate until the score improves."
    },
    {
      q: "How often is my success score updated?",
      a: "Every time you update a section in Form Mode, the readiness score and guidance refresh instantly."
    },
    {
      q: "Can I switch between Form Mode and Chat Mode anytime?",
      a: "Yes. Start in Form Mode for structure, then jump to Chat Mode for quick answers without losing your progress."
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-16 px-5 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q} className="border border-gray-200 rounded-lg bg-white shadow-sm">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="bg-white w-full flex items-center justify-between text-left px-4 sm:px-6 py-4 focus:outline-none"
                >
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{item.q}</h3>
                  </div>
                  <FiChevronDown
                    className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-5 text-sm text-gray-700 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
