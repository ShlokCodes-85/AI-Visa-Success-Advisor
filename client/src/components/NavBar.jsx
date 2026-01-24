function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">
      <div className="font-bold text-2xl text-blue-600">
        🎓 AI Visa Success Advisor
      </div>

      <div className="flex gap-4">
        <button className="px-4 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg hover:bg-white hover:text-blue-600">
          Get Started
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
