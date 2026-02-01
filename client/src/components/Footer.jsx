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
      <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-gray-900 dark:text-white">Success Advisor</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your trusted AI partner for a seamless student visa journey.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Testimonials</a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Contact Us</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300">
            <a href="mailto:shlokjain395@gmail.com" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">shlokjain395@gmail.com</a>
            <a href="mailto:achuttugulla@gmail.com" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">achuttugulla@gmail.com</a>
            <a href="mailto:bhumiupade@gmail.com" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">bhumiupade@gmail.com</a>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Stay Connected</h4>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="flex gap-2">
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
                className={`bg-white dark:bg-gray-700 dark:text-gray-100 flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  status === 'error' ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-700 dark:hover:bg-blue-600 border border-transparent disabled:opacity-70 transition-colors"
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
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 py-4">© 2026 AI Student Visa Success Advisor. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
