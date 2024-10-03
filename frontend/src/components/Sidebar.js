import React, { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          onClick={toggleSidebar}
          className="p-4 focus:outline-none focus:bg-gray-700"
        >
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } lg:block bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0 transition duration-200 ease-in-out`}
      >
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-white block px-2 py-4">
          Finance Manager
        </a>

        {/* Navigation Links */}
        <nav>
          <a href="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-gray-100">
            Dashboard
          </a>
          <a href="/transactions" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-gray-100">
            Transactions
          </a>
          <a href="/analytics" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-gray-100">
            Analytics
          </a>
          <a href="/budget" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-gray-100">
            Budget
          </a>
          <a href="/profile" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-gray-100">
            Profile
          </a>
          <a href="/transactions" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-gray-100">
           Transactions
        </a>

        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
