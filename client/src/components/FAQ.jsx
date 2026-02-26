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

  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section ref={elementRef} id="faq" className="py-8 sm:py-10 lg:py-12 pb-8 sm:pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease-in' }}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 dark:text-white mb-6 sm:mb-8 lg:mb-10 px-2 sm:px-0">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <button
                key={item.q}
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className={`w-full text-left rounded-lg bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/50 transition-all duration-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 focus:outline-none min-h-[44px] sm:min-h-[50px] ${
                  isOpen 
                    ? 'border-2 border-blue-600 dark:border-blue-500 shadow-md dark:shadow-blue-900/30' 
                    : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="pr-2 sm:pr-4 flex-1">
                    <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-white leading-snug">
                      {item.q}
                    </h3>
                  </div>
                  <FiChevronDown
                    size={20}
                    className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : "rotate-0"}`}
                  />
                </div>
                {isOpen && (
                  <div className="pt-2 sm:pt-3 text-xs xs:text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
