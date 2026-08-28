import { Link, useNavigate } from "react-router-dom";
import { useMobile } from "@/hooks/useMobile";
import { HiMenu, HiX } from "react-icons/hi";
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
    <nav className="fixed w-full z-50 drop-shadow-lg bg-primary-1">
      <div className="w-full flex items-center justify-between px-4 py-2 gap-4 whitespace-nowrap">
        {/* Left - Brand */}
        <div className="flex flex-1 justify-start items-center font-bold text-2xl">
          <Link to="/" onClick={closeMenu}>
            TripSummarizer
          </Link>
        </div>

        {/* Middle - Travel Log (Desktop) */}
        {!isMobile && (
          <div className="flex items-center justify-center hover:bg-primary-0 transition-colors duration-200 rounded-xl">
            <Link to="/travel-log" className="px-4 py-2 font-bold">
              - Travel Log -
            </Link>
          </div>
        )}

        {/* Right - Nav Links & Auth */}
        <div className="flex flex-1 items-center justify-end">
          {/* Desktop Nav */}
          {!isMobile && (
            <div className="flex items-center ">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-2 font-bold hover:bg-primary-0 transition-colors duration-200 rounded-2xl"
                >
                  - {link.name} -
                </Link>
              ))}

              {isAuthenticated ? (
                <div className=" flex items-center gap-4 pl-4 pr-4 py-1 border-l">
                  <div className="font-bold flex items-center">
                    {user?.name || "User"}
                  </div>
                  <button
                    onClick={handleSignout}
                    title="Sign Out"
                    className="flex items-center font-medium cursor-pointer bg-red-200 rounded-md pl-2 pr-2 py-1"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className=" flex items-center gap-4 pl-4 pr-4 py-1 border-l">
                  <Link
                    to="/auth"
                    className="flex items-center font-medium cursor-pointer bg-green-200 rounded-md pl-2 pr-2 py-1"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile Toggle */}
          {isMobile && (
            <button onClick={() => setIsOpen(!isOpen)} className="text-xl p-1">
              {isOpen ? <HiX /> : <HiMenu />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isOpen && (
        <div className="p-6 space-y-4 border-t">
          <Link
            to="/travel-log"
            onClick={closeMenu}
            className="block font-medium"
          >
            Travel Log
          </Link>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              className="block font-medium"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t space-y-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="font-semibold">{user?.name || "User"}</div>
                <button
                  onClick={handleSignout}
                  className="w-full text-left font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={closeMenu}
                className="block w-full text-center py-2 border rounded-md font-medium"
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
