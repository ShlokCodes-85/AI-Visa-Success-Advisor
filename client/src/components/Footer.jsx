function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-800">
      <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">Success Advisor</span>
          </div>
          <p className="text-sm text-gray-600">
            Your trusted AI partner for a seamless student visa journey.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            <a href="#features" className="hover:text-blue-600">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600">How It Works</a>
            <a href="#pricing" className="hover:text-blue-600">Pricing</a>
            <a href="#testimonials" className="hover:text-blue-600">Testimonials</a>
            <a href="#faq" className="hover:text-blue-600">FAQ</a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Us</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            <span>support@visasuccess.com</span>
            <span>+1 (800) 123-4567</span>
            <span>123 Global Street, Suite 400,
              World City, 10001</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Stay Connected</h4>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className=" bg-white flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 border border-transparent">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <p className="text-center text-sm text-gray-600 py-4">© 2026 AI Student Visa Success Advisor. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
