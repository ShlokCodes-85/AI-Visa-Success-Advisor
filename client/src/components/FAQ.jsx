import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import useLazyLoad from '../hooks/useLazyLoad';

function FAQ() {
  const { elementRef, isVisible } = useLazyLoad();
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
    <section ref={elementRef} id="faq" className="py-10 pb-12 px-5 bg-white dark:bg-gray-900" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease-in' }}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/50">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="bg-white dark:bg-gray-800 w-full flex items-center justify-between text-left px-4 sm:px-6 py-4 focus:outline-none"
                >
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{item.q}</h3>
                  </div>
                  <FiChevronDown
                    className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-200 dark:border-gray-700">
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
