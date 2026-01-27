function Hero() {
  return (
    <section className="py-16 px-5 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto flex items-center gap-12">
        {/* Left Content */}
        <div className="flex-1">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Unlock Your Dream of Studying Abroad with AI Precision
          </h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Our AI-powered platform guides you through every step of the student visa application, ensuring accuracy, efficiency, and peace of mind.
          </p>
        </div>

        {/* Right Image */}
        <div className="flex-1 hidden lg:flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop"
            alt="Student using laptop"
            className="rounded-lg shadow-lg object-cover w-full max-w-sm h-80"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
