import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store/slices/authSlice.js";
import {
  LogOut,
  Calendar,
  User,
  ShieldCheck,
  Home as HomeIcon,
  MapPin,
  Menu,
  X,
} from "lucide-react";

// Pages (to be created)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MyEvents from "./pages/MyEvents";
import EventDetails from "./pages/EventDetails";
import AllEvents from "./pages/AllEvents";
import About from "./pages/About";

export default function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white/80 py-2.5 px-4 md:px-12 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 text-[11px] font-bold tracking-wider uppercase border-b border-white/5">
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <span className="text-secondary">📞</span> +91 8081-100-200
          </span>
          <span className="hidden sm:flex items-center gap-2">
            <span className="text-secondary">📧</span>{" "}
            info@babafaridgroup.edu.in
          </span>
        </div>
        <div className="flex gap-6">
          <Link
            to="/admin-login"
            className="hover:text-white transition-colors"
          >
            Admin Portal
          </Link>
          <a
            href="https://babafaridgroup.edu.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            BFGI Main Site
          </a>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar bg-white/80 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-12 h-24 border-b border-slate-100 transition-all duration-300">
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="bg-primary p-2.5 rounded-2xl group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-primary/20">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900 leading-none tracking-tighter">
                BABA FARID
              </span>
              <span className="text-[10px] font-black text-secondary tracking-[0.3em] uppercase mt-1">
                Group of Institutions
              </span>
            </div>
          </Link>
        </div>

        <div className="flex-none">
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className="nav-link">
              <HomeIcon className="w-4 h-4" /> Home
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === "admin" ? (
                  <Link
                    to="/admin"
                    className="nav-link text-secondary font-black bg-secondary/5 border border-secondary/10"
                  >
                    <ShieldCheck className="w-4 h-4" /> Admin Panel
                  </Link>
                ) : (
                  <Link to="/my-events" className="nav-link">
                    <User className="w-4 h-4" /> My Events
                  </Link>
                )}
                <div className="w-px h-6 bg-slate-200 mx-3"></div>
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm text-error hover:bg-error/5 lowercase font-bold"
                >
                  <LogOut className="w-4 h-4" /> logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4 ml-6">
                <Link
                  to="/login"
                  className="text-slate-900 font-bold text-sm hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-secondary rounded-2xl px-8 h-12 text-white shadow-xl shadow-secondary/20 hover:shadow-secondary/40 border-none"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="btn btn-ghost btn-circle lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-xl absolute w-full z-40 border-b border-slate-100 p-4 flex flex-col gap-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-slate-700 font-bold w-full p-3 hover:bg-slate-50 rounded-xl transition-colors">
              <HomeIcon className="w-5 h-5 mr-3" /> Home
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === "admin" ? (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center text-secondary font-black bg-secondary/5 border border-secondary/10 w-full p-3 rounded-xl transition-colors"
                  >
                    <ShieldCheck className="w-5 h-5 mr-3" /> Admin Panel
                  </Link>
                ) : (
                  <Link to="/my-events" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-slate-700 font-bold w-full p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <User className="w-5 h-5 mr-3" /> My Events
                  </Link>
                )}
                <div className="w-full h-px bg-slate-100 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center font-bold text-error hover:bg-error/5 w-full p-3 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-4">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn btn-outline border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 w-full rounded-xl h-12 font-bold"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn btn-secondary w-full rounded-xl h-12 text-white shadow-lg shadow-secondary/20 font-bold"
                >
                  Sign Up
                </Link>
              </div>
            )}
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-8 min-h-[calc(100vh-250px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<AllEvents />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white pt-12 pb-6">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-10 h-10 text-secondary" />
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-tight">
                  BABA FARID
                </span>
                <span className="text-xs font-semibold text-secondary tracking-widest">
                  GROUP OF INSTITUTIONS
                </span>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Baba Farid Group of Institutions (BFGI) is India’s Best Private
              College in Punjab offering Undergraduate & Postgraduate Courses.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 border-b-2 border-secondary w-fit pr-8 pb-1">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link to="/" className="hover:text-secondary transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-secondary transition-colors"
                >
                  Student Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="hover:text-secondary transition-colors"
                >
                  Registration
                </Link>
              </li>
              <li>
                <a
                  href="https://babafaridgroup.edu.in/top-engineering-colleges-in-punjab-contact.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 border-b-2 border-secondary w-fit pr-8 pb-1">
              Contact Info
            </h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <a 
                  href="https://www.google.com/maps/place/Baba+Farid+Group+of+Institutions/@30.2516314,74.8412991,376m/data=!3m1!1e3!4m6!3m5!1s0x391731172aeedaaf:0x7d09b26e96ee593b!8m2!3d30.2510336!4d74.8420018!16s%2Fg%2F11b7y78_kz?entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-start gap-3 hover:text-secondary transition-colors group"
                >
                  <MapPin className="w-5 h-5 text-secondary shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Bathinda-Muktsar Road, Bathinda, Punjab 151001</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-secondary shrink-0" />
                <span>Mon - Sat: 9:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 mt-12 pt-6 border-t border-white/10 text-center text-xs text-white/50">
          <p>
            © 2026 Baba Farid Group of Institutions. All Rights Reserved. |
            Managed by BFGI IT Cell
          </p>
        </div>
      </footer>
    </div>
  );
}
