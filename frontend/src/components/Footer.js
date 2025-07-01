import { Link } from "react-router-dom"
import { Twitter, Instagram, Facebook, Mail, Phone, MapPin, Shield, FileText, HelpCircle, Wallet } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: "Twitter",
      href: "https://twitter.com/financemanager",
      icon: Twitter,
      color: "hover:text-blue-400",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/financemanager",
      icon: Instagram,
      color: "hover:text-pink-400",
    },
    {
      name: "Facebook",
      href: "https://facebook.com/financemanager",
      icon: Facebook,
      color: "hover:text-blue-600",
    },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Brand Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Finance Manager</h3>
              <p className="text-sm text-gray-400">Personal Finance Made Simple</p>
            </div>
          </div>
          <p className="text-gray-400 mb-6 max-w-md">
            Take control of your financial future with our comprehensive personal finance management platform. Track
            expenses, manage budgets, and achieve your financial goals with confidence.
          </p>

          {/* Contact Info */}
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>support@financemanager.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <p>&copy; {currentYear} Finance Manager. All rights reserved.</p>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-500 font-medium">Bank-level Security</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Follow us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 bg-gray-800 rounded-lg text-gray-400 ${social.color} transition-all hover:bg-gray-700`}
                      aria-label={social.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-1">
                <Wallet className="w-3 h-3" />
                <span>FDIC Insured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer