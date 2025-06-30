"use client"

import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Target,
  CreditCard,
  TrendingUp,
  FileText,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Menu,
  X,
} from "lucide-react"

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()

  const links = [
    {
      path: "/dashboard/overview",
      label: "Overview",
      icon: BarChart3,
      description: "Financial overview",
    },
    {
      path: "/dashboard/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Main dashboard",
    },
    {
      path: "/dashboard/accounts",
      label: "Accounts",
      icon: Wallet,
      description: "Manage accounts",
    },
    {
      path: "/dashboard/transactions",
      label: "Transactions",
      icon: Receipt,
      description: "Track spending",
    },
    {
      path: "/dashboard/budgets",
      label: "Budgets",
      icon: PiggyBank,
      description: "Budget planning",
    },
    {
      path: "/dashboard/goals",
      label: "Goals",
      icon: Target,
      description: "Financial goals",
    },
    {
      path: "/dashboard/debts",
      label: "Debts",
      icon: CreditCard,
      description: "Debt management",
    },
    {
      path: "/dashboard/investments",
      label: "Investments",
      icon: TrendingUp,
      description: "Investment portfolio",
    },
    {
      path: "/dashboard/reports",
      label: "Reports",
      icon: FileText,
      description: "Financial reports",
    },
    {
      path: "/settings",
      label: "Settings",
      icon: Settings,
      description: "App settings",
    },
  ]

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className={`p-6 border-b border-gray-700 ${isCollapsed ? "px-4" : ""}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">Finance Manager</h1>
              <p className="text-xs text-gray-400">Personal Finance</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.path

            return (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    } ${isCollapsed ? "justify-center" : ""}`
                  }
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                  {!isCollapsed && (
                    <div className="flex-1">
                      <span className="font-medium">{link.label}</span>
                      <p className="text-xs opacity-75 mt-0.5">{link.description}</p>
                    </div>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      <div className="font-medium">{link.label}</div>
                      <div className="text-xs text-gray-300">{link.description}</div>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-gray-700 ${isCollapsed ? "px-2" : ""}`}>
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-white">User Account</p>
              <p className="text-xs text-gray-400">user@example.com</p>
            </div>
          )}
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex flex-col bg-gray-800 text-white h-screen transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        <SidebarContent />

        {/* Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-8 bg-gray-800 border-2 border-gray-600 rounded-full p-1 hover:bg-gray-700 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-300" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-300" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed left-0 top-0 h-full bg-gray-800 text-white z-50 transition-transform duration-300 w-72 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>
    </>
  )
}

export default Sidebar