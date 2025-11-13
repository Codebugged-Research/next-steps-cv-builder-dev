import { LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Header = ({ onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-gray-200 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 pl-3 sm:pl-0">
            <img
              src="/NEXT-STEPS-LOGO.png"
              alt="Next Steps Logo"
              className="h-8 sm:h-10 flex-shrink-0"
            />
            <h1 className="text-sm sm:text-lg md:text-xl font-semibold text-[#04445E] truncate">
              <span className="hidden sm:inline">Next Steps-USMLE CV Builder</span>
              <span className="sm:hidden text-lg ">Next Steps CV Portal</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-[#04445E] hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#04445E] hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 top-14 sm:top-16"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <div className="md:hidden absolute left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 animate-slideDown">
              <div className="px-4 py-3 space-y-3">
                <div className="text-sm text-gray-600 px-3 py-2">
                  Welcome
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 text-[#04445E] hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;