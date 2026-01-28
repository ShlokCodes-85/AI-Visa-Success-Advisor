import useLazyLoad from '../hooks/useLazyLoad';
import useTypewriter from '../hooks/useTypewriter';

function Hero() {
  const { elementRef, isVisible } = useLazyLoad();
  const heroText = useTypewriter('Unlock Your Dream of Studying Abroad with AI Precision', 30, isVisible);

  return (
    <section ref={elementRef} className="py-16 px-5 pb-48 bg-gradient-to-br from-blue-50 to-indigo-50" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease-in' }}>
      <div className="max-w-6xl mx-auto flex items-center gap-12">
        {/* Left Content */}
        <div className="flex-1">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            {heroText}
          </h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Our AI-powered platform guides you through every step of the student visa application, ensuring accuracy, efficiency, and peace of mind.
          </p>
        </div>

        {/* Right Image */}
        <div className="w-150 flex-1 hidden lg:flex justify-center -mt-16">
          <img
            src="/AI_Visa_Image.png"
            alt="Student using laptop"
            loading="lazy"
            className="rounded-lg shadow-lg object-cover w-full max-w-2xl h-80"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
