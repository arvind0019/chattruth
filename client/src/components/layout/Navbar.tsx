import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MessageSquareText, Menu, X, Shield, User, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-[#FFFEFA] border-b border-[#E3E1D9] sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="ChatTruth" 
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EEF2FF] text-[#1E40AF] border border-[#DBEAFE]">
              AI Dynamics
            </span>
          </Link>

          {/* Desktop Navigation Links (>=1024px) */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-[#5A6559]">
            <Link
              to="/analyze"
              className={`hover:text-[#304A34] transition-colors ${isActive('/analyze') ? 'text-[#304A34] font-semibold' : ''}`}
            >
              Analyze
            </Link>
            <Link
              to="/relationship"
              className={`hover:text-[#304A34] transition-colors ${isActive('/relationship') ? 'text-[#304A34] font-semibold' : ''}`}
            >
              Relationship
            </Link>
            <Link
              to="/friends"
              className={`hover:text-[#304A34] transition-colors ${isActive('/friends') ? 'text-[#304A34] font-semibold' : ''}`}
            >
              Friends
            </Link>
            <Link
              to="/family"
              className={`hover:text-[#304A34] transition-colors ${isActive('/family') ? 'text-[#304A34] font-semibold' : ''}`}
            >
              Family
            </Link>
            <Link
              to="/sample-report"
              className={`hover:text-[#304A34] transition-colors ${isActive('/sample-report') ? 'text-[#304A34] font-semibold' : ''}`}
            >
              Sample Report
            </Link>
            <Link
              to="/pricing"
              className={`hover:text-[#304A34] transition-colors ${isActive('/pricing') ? 'text-[#304A34] font-semibold' : ''}`}
            >
              Pricing
            </Link>
            <Link
              to="/faq"
              className={`hover:text-[#304A34] transition-colors ${isActive('/faq') ? 'text-[#304A34] font-semibold' : ''}`}
            >
              FAQ
            </Link>
          </div>

          {/* Auth Actions (>=1024px) */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#EDF3EB] text-[#304A34] hover:bg-[#DCE8D6] transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md text-[#242923] hover:bg-[#F7F6F0] transition-colors"
                >
                  <User className="w-4 h-4 text-[#718B65]" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-[#5A6559] hover:text-[#991B1B] transition-colors rounded-md hover:bg-[#FEE2E2]"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-[#242923] hover:text-[#304A34] transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-[#FFFEFA] bg-[#304A34] hover:bg-[#263B29] rounded-lg shadow-xs transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile & Tablet menu button (<1024px) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#5A6559] hover:text-[#242923] hover:bg-[#F7F6F0] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E3E1D9] bg-[#FFFEFA] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in duration-150">
          <Link
            to="/analyze"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#242923] hover:bg-[#F7F6F0] rounded-md"
          >
            Analyze a Chat
          </Link>
          <Link
            to="/relationship"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#5A6559] hover:bg-[#F7F6F0] rounded-md"
          >
            Relationship Analysis
          </Link>
          <Link
            to="/friends"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#5A6559] hover:bg-[#F7F6F0] rounded-md"
          >
            Friendships & Groups
          </Link>
          <Link
            to="/family"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#5A6559] hover:bg-[#F7F6F0] rounded-md"
          >
            Family Dynamics
          </Link>
          <Link
            to="/sample-report"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#5A6559] hover:bg-[#F7F6F0] rounded-md"
          >
            Sample Report
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#5A6559] hover:bg-[#F7F6F0] rounded-md"
          >
            Pricing
          </Link>
          <Link
            to="/faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-[#5A6559] hover:bg-[#F7F6F0] rounded-md"
          >
            FAQ
          </Link>

          <div className="pt-4 border-t border-[#E3E1D9] space-y-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-[#304A34] bg-[#EDF3EB] rounded-md"
                >
                  User Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-[#304A34] bg-[#DCE8D6] rounded-md"
                  >
                    Admin Control Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-[#991B1B] hover:bg-[#FEE2E2] rounded-md"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-[#242923] hover:bg-[#F7F6F0] rounded-md"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-2 text-base font-medium text-[#FFFEFA] bg-[#304A34] rounded-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
