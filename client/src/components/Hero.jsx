import { useState } from 'react';
import useLazyLoad from '../hooks/useLazyLoad';
import useTypewriter from '../hooks/useTypewriter';
import AuthModal from './AuthModal';

function Hero() {
  const { elementRef, isVisible } = useLazyLoad();
  const heroText = useTypewriter('Unlock Your Dream of Studying Abroad with AI Precision', 30, isVisible);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <section ref={elementRef} className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 pb-16 sm:pb-32 lg:pb-48 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 w-full" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease-in' }}>
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 lg:gap-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 w-full">
          {/* Left Content */}
          <div className="flex-1 w-full text-center lg:text-left">
            <h1 className="hero-heading-font text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 lg:mb-6 leading-tight">
              {heroText}
              {heroText.length < 'Unlock Your Dream of Studying Abroad with AI Precision'.length && (
                <span className="animate-pulse ml-1 inline-block w-1 h-6 xs:h-8 sm:h-12 lg:h-16 xl:h-20 bg-gray-900 dark:bg-white"></span>
              )}
            </h1>
            
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
              Our AI-powered platform guides you through every step of the student visa application, ensuring accuracy, efficiency, and peace of mind.
            </p>
          </div>

          {/* Right Image */}
          <div className="w-full flex-1 flex md:flex justify-center -mt-0 sm:-mt-8 md:-mt-12 lg:-mt-16">
            <img
              src="/AI_Visa_Image.png"
              alt="Student using laptop"
              loading="lazy"
              className="rounded-lg shadow-lg dark:shadow-xl object-cover w-11/12 sm:w-4/5 md:w-full h-auto max-h-48 sm:max-h-64 md:max-h-80 lg:max-h-96 max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl"
            />
          </div>
        </div>

        {/* Get Started Button - Below Everything */}
        <div className="flex justify-center w-full mt-4 sm:mt-6">
          <button 
            onClick={() => setShowAuth(true)}
            className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-medium text-base sm:text-lg md:text-xl hover:bg-blue-700 transition-colors w-[80%] min-h-[52px] sm:min-h-[56px]">
            Get Started
          </button>
        </div>
      </div>
      
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </section>
  );
}

export default Hero;
