import { useState } from 'react';
import useLazyLoad from '../hooks/useLazyLoad';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function Footer() {
  const { elementRef, isVisible } = useLazyLoad();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value.trim());

  const handleSubscribe = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email.');
      return;
    }

    if (!isValidEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      setStatus('loading');
      setMessage('');

      const response = await fetch(`${BACKEND_URL}/api/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Subscription failed. Please try again.');
      }

      setStatus('success');
      setMessage(data?.message || 'You are subscribed!');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error?.message || 'Subscription failed. Please try again.');
    }
  };
  return (
    <footer ref={elementRef} className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease-in' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Success Advisor</span>
          </div>
          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Your trusted AI partner for a seamless student visa journey.
          </p>
        </div>

        <div>
          <h4 className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">Quick Links</h4>
          <div className="flex flex-row flex-wrap lg:flex-col gap-3 sm:gap-4 lg:gap-2 text-xs xs:text-sm text-gray-700 dark:text-gray-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-relaxed">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-relaxed">How It Works</a>
            <a href="#testimonials" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-relaxed">Testimonials</a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-relaxed">FAQ</a>
          </div>
        </div>

        <div>
          <h4 className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">Contact Us</h4>
          <div className="flex flex-col gap-1.5 sm:gap-2 text-xs xs:text-sm">
            <a href="mailto:shlokjain395@gmail.com" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all">shlokjain395@gmail.com</a>
            <a href="mailto:achuttugulla@gmail.com" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all">achuttugulla@gmail.com</a>
            <a href="mailto:bhumiupade@gmail.com" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all">bhumiupade@gmail.com</a>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-gray-100">Stay Connected</h4>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="flex flex-col xs:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status !== 'idle') {
                    setStatus('idle');
                    setMessage('');
                  }
                }}
                className={`bg-white dark:bg-gray-700 dark:text-gray-100 flex-1 px-2 xs:px-3 py-2 border rounded-lg text-xs xs:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[44px] box-border ${
                  status === 'error' ? 'border-red-400' : 'border-transparent dark:border-gray-600'
                }`}
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-3 xs:px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg text-xs xs:text-sm hover:bg-blue-700 dark:hover:bg-blue-600 border border-transparent disabled:opacity-70 transition-colors font-medium min-h-[44px] xs:min-h-[auto] whitespace-nowrap"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {message && (
              <p
                className={`text-xs font-medium ${status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                role="status"
                aria-live="polite"
              >
                {message}
              </p>
            )}
          </form>
          
          <div className="mt-4">
            <h4 className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Follow us</h4>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg transition-colors hover:opacity-80"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm4.006-10.357c-.797 0-1.441-.645-1.441-1.44s.645-1.44 1.441-1.44c.795 0 1.439.645 1.439 1.44s-.644 1.44-1.439 1.44z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg transition-colors hover:opacity-80"
                aria-label="Twitter"
                title="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9-1.5 9-5.5v-.5a4.5 4.5 0 00.78-2.07z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg transition-colors hover:opacity-80"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 4a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-xs xs:text-sm text-gray-600 dark:text-gray-400 py-3 sm:py-4 px-4">
          © {new Date().getFullYear()} AI Student Visa Success Advisor. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
