// File: src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    { path: '/dashboard/overview', label: 'Overview' },
    { path: '/dashboard/transactions', label: 'Transactions' },
    { path: '/dashboard/budgets', label: 'Budgets' },
    { path: '/dashboard/goals', label: 'Goals' },
    { path: '/dashboard/reports', label: 'Reports' },
    { path: '/dashboard/accounts', label: 'Accounts' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="sidebar bg-gray-800 text-white h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Finance Manager</h1>
      <ul className="space-y-4">
        {links.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                isActive ? 'text-blue-500 font-semibold' : 'text-white'
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
