import React, { useState } from 'react';

const Header = () => {
  // State to handle mobile menu toggle
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          Finance Manager
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            {/* Icon for hamburger */}
            <svg
              className="w-6 h-6"
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

        {/* Navigation Links */}
        <nav className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
          <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <li>
              <a href="/" className="hover:text-gray-400">Dashboard</a>
            </li>
            <li>
              <a href="/transactions" className="hover:text-gray-400">Transactions</a>
            </li>
            <li>
              <a href="/analytics" className="hover:text-gray-400">Analytics</a>
            </li>
            <li>
              <a href="/budget" className="hover:text-gray-400">Budget</a>
            </li>
            <li>
              <a href="/profile" className="hover:text-gray-400">Profile</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden">
          <nav className="mt-2">
            <ul className="flex flex-col space-y-2">
              <li>
                <a href="/" className="hover:text-gray-400">Dashboard</a>
              </li>
              <li>
                <a href="/transactions" className="hover:text-gray-400">Transactions</a>
              </li>
              <li>
                <a href="/analytics" className="hover:text-gray-400">Analytics</a>
              </li>
              <li>
                <a href="/budget" className="hover:text-gray-400">Budget</a>
              </li>
              <li>
                <a href="/profile" className="hover:text-gray-400">Profile</a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
