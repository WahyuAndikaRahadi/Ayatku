import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isContentDropdownOpen, setIsContentDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Close dropdowns when mobile menu is toggled
    setIsContentDropdownOpen(false);
    setIsToolsDropdownOpen(false);
  };

  const toggleContentDropdown = () => {
    setIsContentDropdownOpen(!isContentDropdownOpen);
    setIsToolsDropdownOpen(false); // Close other dropdown
  };

  const toggleToolsDropdown = () => {
    setIsToolsDropdownOpen(!isToolsDropdownOpen);
    setIsContentDropdownOpen(false); // Close other dropdown
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Function to handle hard redirects and close menus
  const handleNavigation = (path) => {
    window.location.href = path;
    if (isOpen) { // Close mobile menu if open
      setIsOpen(false);
    }
    // Close dropdowns
    setIsContentDropdownOpen(false);
    setIsToolsDropdownOpen(false);
  };

  // Dropdown menu variants for Framer Motion
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scaleY: 0.95, originY: 'top' },
    visible: { opacity: 1, y: 0, scaleY: 1, originY: 'top', transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scaleY: 0.95, originY: 'top', transition: { duration: 0.15, ease: "easeIn" } },
  };

  return (
    <nav className="bg-white shadow-md z-50 sticky top-0"> {/* Tambahkan sticky dan top-0 di sini */}
      <div className="container-custom mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand Name */}
          <div className="flex items-center ml-0 md:-ml-3">
            <a
              href="/"
              className="flex items-center"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/');
              }}
            >
              <img src="/icons/ayatku.png" alt="Ayatku Logo" className="h-20 w-25 mr-2" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2 lg:space-x-4 flex-grow justify-center">
            <a
              href="/"
              className={`px-3 py-2 rounded-md font-medium transition-colors ${
                isActive('/')
                  ? 'text-emerald-600 font-semibold bg-emerald-50'
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/');
              }}
            >
              Beranda
            </a>
            <a
              href="/about"
              className={`px-3 py-2 rounded-md font-medium transition-colors ${
                isActive('/about')
                  ? 'text-emerald-600 font-semibold bg-emerald-50'
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/about');
              }}
            >
              About
            </a>
            <a
              href="/quran"
              className={`px-3 py-2 rounded-md font-medium transition-colors ${
                isActive('/quran')
                  ? 'text-emerald-600 font-semibold bg-emerald-50'
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/quran');
              }}
            >
              Al-Quran
            </a>

            {/* Pustaka Islami Dropdown */}
            <div className="relative">
              <button
                onClick={toggleContentDropdown}
                className={`px-3 py-2 rounded-md font-medium transition-colors flex items-center ${
                  isContentDropdownOpen || ['/hadith', '/asmaulhusna', '/doa', '/blog'].includes(location.pathname)
                    ? 'text-emerald-600 font-semibold bg-emerald-50'
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                Pustaka Islami
                {isContentDropdownOpen ? <FaChevronUp className="ml-1 h-3 w-3" /> : <FaChevronDown className="ml-1 h-3 w-3" />}
              </button>
              <AnimatePresence>
                {isContentDropdownOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  >
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <a
                        href="/hadith"
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/hadith') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        role="menuitem"
                        onClick={(e) => { e.preventDefault(); handleNavigation('/hadith'); }}
                      >
                        Hadist
                      </a>
                      <a
                        href="/asmaulhusna"
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/asmaulhusna') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        role="menuitem"
                        onClick={(e) => { e.preventDefault(); handleNavigation('/asmaulhusna'); }}
                      >
                        Asmaul Husna
                      </a>
                      <a
                        href="/doa"
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/doa') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        role="menuitem"
                        onClick={(e) => { e.preventDefault(); handleNavigation('/doa'); }}
                      >
                        Doa-doa
                      </a>
                      <a
                        href="/blog"
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/blog') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        role="menuitem"
                        onClick={(e) => { e.preventDefault(); handleNavigation('/blog'); }}
                      >
                        Artikel Islami
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Fitur & Bantuan Dropdown */}
            <div className="relative">
              <button
                onClick={toggleToolsDropdown}
                className={`px-3 py-2 rounded-md font-medium transition-colors flex items-center ${
                  isToolsDropdownOpen || ['/calendar', '/kiblat', '/prayer', '/ai-qna', '/tasbih'].includes(location.pathname)
                    ? 'text-emerald-600 font-semibold bg-emerald-50'
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                Fitur & Bantuan
                {isToolsDropdownOpen ? <FaChevronUp className="ml-1 h-3 w-3" /> : <FaChevronDown className="ml-1 h-3 w-3" />}
              </button>
              <AnimatePresence>
                {isToolsDropdownOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  >
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <a
                        href="/calendar"
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/calendar') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        role="menuitem"
                        onClick={(e) => { e.preventDefault(); handleNavigation('/calendar'); }}
                      >
                        Kalender
                      </a>
                      <a
                        href="/kiblat"
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/kiblat') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        role="menuitem"
                        onClick={(e) => { e.preventDefault(); handleNavigation('/kiblat'); }}
                      >
                        Kiblat
                      </a>
                      <a
                        href="/prayer"
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/prayer') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        role="menuitem"
                        onClick={(e) => { e.preventDefault(); handleNavigation('/prayer'); }}
                      >
                        Jadwal Sholat
                      </a>
                      <a
                        href="/ai-qna"
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/ai-qna') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        role="menuitem"
                        onClick={(e) => { e.preventDefault(); handleNavigation('/ai-qna'); }}
                      >
                        Tanya Jawab AI
                      </a>
                      <a
                        href="/tasbih"
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/tasbih') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        role="menuitem"
                        onClick={(e) => { e.preventDefault(); handleNavigation('/tasbih'); }}
                      >
                        Tasbih Digital
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-emerald-600 focus:outline-none"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-inner"
          >
            <div className="container-custom mx-auto px-4 py-3 space-y-1">
              <a
                href="/"
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive('/')
                    ? 'text-emerald-600 bg-gray-50 font-semibold'
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                }`}
                onClick={(e) => { e.preventDefault(); handleNavigation('/'); }}
              >
                Beranda
              </a>
              <a
                href="/about"
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive('/about')
                    ? 'text-emerald-600 bg-gray-50 font-semibold'
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                }`}
                onClick={(e) => { e.preventDefault(); handleNavigation('/about'); }}
              >
                About
              </a>
              <a
                href="/quran"
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive('/quran')
                    ? 'text-emerald-600 bg-gray-50 font-semibold'
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                }`}
                onClick={(e) => { e.preventDefault(); handleNavigation('/quran'); }}
              >
                Al-Quran
              </a>
              
              {/* Mobile Dropdown for Pustaka Islami */}
              <div className="relative">
                <button
                  onClick={toggleContentDropdown}
                  className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors flex items-center justify-between ${
                    isContentDropdownOpen || ['/hadith', '/asmaulhusna', '/doa', '/blog'].includes(location.pathname)
                      ? 'text-emerald-600 bg-gray-50 font-semibold'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  Pustaka Islami
                  {isContentDropdownOpen ? <FaChevronUp className="ml-1 h-3 w-3" /> : <FaChevronDown className="ml-1 h-3 w-3" />}
                </button>
                <AnimatePresence>
                  {isContentDropdownOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="pl-6 py-1 space-y-1"
                    >
                      <a
                        href="/hadith"
                        className={`block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/hadith') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        onClick={(e) => { e.preventDefault(); handleNavigation('/hadith'); }}
                      >
                        Hadist
                      </a>
                      <a
                        href="/asmaulhusna"
                        className={`block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/asmaulhusna') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        onClick={(e) => { e.preventDefault(); handleNavigation('/asmaulhusna'); }}
                      >
                        Asmaul Husna
                      </a>
                      <a
                        href="/doa"
                        className={`block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/doa') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        onClick={(e) => { e.preventDefault(); handleNavigation('/doa'); }}
                      >
                        Doa-doa
                      </a>
                      <a
                        href="/blog"
                        className={`block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/blog') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        onClick={(e) => { e.preventDefault(); handleNavigation('/blog'); }}
                      >
                        Artikel Islami
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Dropdown for Fitur & Bantuan */}
              <div className="relative">
                <button
                  onClick={toggleToolsDropdown}
                  className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors flex items-center justify-between ${
                    isToolsDropdownOpen || ['/calendar', '/kiblat', '/prayer', '/ai-qna', '/tasbih'].includes(location.pathname)
                      ? 'text-emerald-600 bg-gray-50 font-semibold'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  Fitur & Bantuan
                  {isToolsDropdownOpen ? <FaChevronUp className="ml-1 h-3 w-3" /> : <FaChevronDown className="ml-1 h-3 w-3" />}
                </button>
                <AnimatePresence>
                  {isToolsDropdownOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="pl-6 py-1 space-y-1"
                    >
                      <a
                        href="/calendar"
                        className={`block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/calendar') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        onClick={(e) => { e.preventDefault(); handleNavigation('/calendar'); }}
                      >
                        Kalender
                      </a>
                      <a
                        href="/kiblat"
                        className={`block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/kiblat') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        onClick={(e) => { e.preventDefault(); handleNavigation('/kiblat'); }}
                      >
                        Kiblat
                      </a>
                      <a
                        href="/prayer"
                        className={`block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/prayer') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        onClick={(e) => { e.preventDefault(); handleNavigation('/prayer'); }}
                      >
                        Jadwal Sholat & Imsak
                      </a>
                      <a
                        href="/ai-qna"
                        className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                          isActive('/ai-qna')
                            ? 'text-emerald-600 bg-gray-50 font-semibold'
                            : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                        }`}
                        onClick={(e) => { e.preventDefault(); handleNavigation('/ai-qna'); }}
                      >
                        Tanya Jawab AI
                      </a>
                      <a
                        href="/tasbih"
                        className={`block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600 ${isActive('/tasbih') ? 'bg-gray-100 text-emerald-600 font-semibold' : ''}`}
                        onClick={(e) => { e.preventDefault(); handleNavigation('/tasbih'); }}
                      >
                        Tasbih Digital
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;