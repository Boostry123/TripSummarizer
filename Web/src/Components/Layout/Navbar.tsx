import { Link, useNavigate } from "react-router-dom";
import { useMobile } from "@/hooks/useMobile";
import { HiMenu, HiX, HiUserCircle, HiMap } from "react-icons/hi";
import { FaDoorClosed, FaDoorOpen } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { user, signout, isAuthenticated } = useAuth();

  const navLinks = [
    { name: "Features", path: "/features" },
    { name: "About", path: "/about" },
  ];

  if (isAuthenticated) {
    navLinks.push({ name: "Recommendations", path: "/recommendations" });
  }

  const closeMenu = () => setIsOpen(false);

  const handleSignout = () => {
    signout();
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left - Brand */}
        <div className="flex-1 flex justify-start">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400"
            onClick={closeMenu}
          >
            TripSummarizer
          </Link>
        </div>

        {/* Middle - Travel Log (Desktop) */}
        {!isMobile && (
          <div className="flex-1 flex justify-center">
            <Link
              to="/travel-log"
              className="group flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-6 py-2 rounded-full text-sm font-bold border border-indigo-100 dark:border-indigo-800/30 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-sm shadow-indigo-200/50 dark:shadow-none"
            >
              <HiMap className="text-lg group-hover:rotate-12 transition-transform" />
              Travel Log
            </Link>
          </div>
        )}

        {/* Right - Nav Links & Auth */}
        <div className="flex-1 flex justify-end">
          {/* Desktop Nav */}
          {!isMobile && (
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <HiUserCircle className="text-xl text-indigo-500" />
                    {user?.name || "User"}
                  </div>
                  <button
                    onClick={handleSignout}
                    className="group relative flex items-center justify-center p-2 text-red-500 hover:text-red-600 transition-colors"
                    title="Sign Out"
                  >
                    <FaDoorClosed className="text-2xl group-hover:hidden" />
                    <FaDoorOpen className="text-2xl hidden group-hover:block" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}

          {/* Mobile Toggle */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-2xl text-slate-600 dark:text-slate-400 p-1"
            >
              {isOpen ? <HiX /> : <HiMenu />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 space-y-4 animate-in slide-in-from-top-2 shadow-xl">
          <Link
            to="/travel-log"
            className="flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 py-3 rounded-xl font-bold border border-indigo-100 dark:border-indigo-800/30 mb-2"
            onClick={closeMenu}
          >
            <HiMap /> Travel Log
          </Link>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block text-base font-medium text-slate-600 dark:text-slate-400 px-2 py-1"
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-base font-semibold text-slate-700 dark:text-slate-200">
                  <HiUserCircle className="text-2xl text-indigo-500" />
                  {user?.name || "User"}
                </div>
                <button
                  onClick={handleSignout}
                  className="group w-full flex items-center justify-center gap-2 py-3 rounded-xl text-red-500 bg-red-50 dark:bg-red-900/10 font-bold"
                >
                  <div className="relative">
                    <FaDoorClosed className="text-2xl group-hover:hidden" />
                    <FaDoorOpen className="text-2xl hidden group-hover:block" />
                  </div>
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={closeMenu}
                className="block w-full text-center bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
