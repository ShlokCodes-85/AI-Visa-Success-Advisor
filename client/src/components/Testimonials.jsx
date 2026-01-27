function Testimonials() {
  const testimonials = [
    {
      name: "Aisha Khan",
      location: "MS Applicant, UK",
      quote:
        "My success score jumped 18 points after fixing weak documents the form flagged. It told me exactly what to improve.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
      focus: "Form Mode",
      rating: 5
    },
    {
      name: "David Chen",
      location: "Undergrad Applicant, Canada",
      quote:
        "The scorecard predicted my gaps and the checklist kept me on track. No surprises at the visa interview.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      focus: "Form Mode",
      rating: 4
    },
    {
      name: "Emma Rodriguez",
      location: "PhD Candidate, Australia",
      quote:
        "The chatbot coached me on tricky DS-160 questions in minutes. I walked into the interview confident.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      focus: "Chat Mode",
      rating: 5
    },
    {
      name: "Samuel Wright",
      location: "MBA Applicant, USA",
      quote:
        "Loved how the form explained each metric in the success score. I fixed my financial proof and boosted my readiness.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel",
      focus: "Form Mode",
      rating: 4
    },
    {
      name: "Li Na",
      location: "STEM Grad, Singapore",
      quote:
        "I used the chatbot to rehearse interview answers. The follow-up prompts felt like a real officer, super helpful!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LiNa",
      focus: "Chat Mode",
      rating: 5
    },
    {
      name: "Omar El-Sayed",
      location: "Masters Applicant, Germany",
      quote:
        "The success score surfaced a weak home-country ties section. Updated it and my score went from 62 to 84.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar",
      focus: "Form Mode",
      rating: 3
    }
  ];

  // Duplicate the list to enable a seamless marquee loop.
  const looped = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-16 px-5 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            What Our Successful Students Say
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Real outcomes from the success score and visa chatbot
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div className="testimonials-marquee">
              {looped.map((testimonial, index) => (
                <div
                  key={`${testimonial.name}-${index}`}
                  className="testimonial-card bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {testimonial.name}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                          {testimonial.focus}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>

                  <p className="text-gray-800 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div
                    className="flex gap-1 mt-3"
                    aria-label={`${testimonial.rating} out of 5 stars`}
                  >
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                      >
                        ★
                      </span>
                    ))}
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
