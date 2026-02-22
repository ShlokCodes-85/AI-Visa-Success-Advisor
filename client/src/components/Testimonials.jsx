import useLazyLoad from '../hooks/useLazyLoad';

function Testimonials() {
  const { elementRef, isVisible } = useLazyLoad();
  const testimonials = [
    {
      name: "Aisha Khan",
      location: "Beta Tester",
      quote:
        "Early access gave me the chance to test the form validator before launch. The feedback was incredibly helpful for understanding what a strong application looks like.",
      focus: "Form Mode"
    },
    {
      name: "David Chen",
      location: "Early Access User",
      quote:
        "As a beta tester, I really appreciated how the platform helped me identify gaps in my application documents early on.",
      focus: "Form Mode"
    },
    {
      name: "Emma Rodriguez",
      location: "Beta Tester",
      quote:
        "Being part of the early access program let me explore the chatbot feature while it was still in development. Valuable experience!",
      focus: "Chat Mode"
    },
    {
      name: "Samuel Wright",
      location: "Early Access User",
      quote:
        "I enjoyed testing the success score metrics as a beta user. The interface is intuitive and the explanations are really clear.",
      focus: "Form Mode"
    },
    {
      name: "Li Na",
      location: "Beta Tester",
      quote:
        "The chatbot rehearsal feature worked great during our early access testing. It's a solid tool for interview prep.",
      focus: "Chat Mode"
    },
    {
      name: "Omar El-Sayed",
      location: "Early Access User",
      quote:
        "Testing the platform as a beta user was a great way to see how it evolves. The support team was responsive to feedback.",
      focus: "Form Mode"
    }
  ];

  const looped = [...testimonials, ...testimonials];

  return (
    <section ref={elementRef} id="testimonials" className="py-8 sm:py-10 lg:py-12 pb-8 sm:pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease-in' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 lg:mb-10 px-2 sm:px-0">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            What Our Beta Testers Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 sm:mt-4 text-sm sm:text-base lg:text-lg">
            Feedback from early access users
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div className="testimonials-marquee">
              {looped.map((testimonial, index) => (
                <div
                  key={`${testimonial.name}-${index}`}
                  className="testimonial-card bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md dark:hover:shadow-blue-900/20 transition-shadow flex flex-col"
                >
                  <p className="text-gray-800 dark:text-gray-300 italic leading-relaxed mb-3 sm:mb-4 text-xs xs:text-sm sm:text-base">
                    "{testimonial.quote}"
                  </p>

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm xs:text-base">
                        {testimonial.name}
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 whitespace-nowrap">
                        {testimonial.focus}
                      </span>
                    </div>
                    <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
