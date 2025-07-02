import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import { motion } from 'framer-motion'


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  // Function to handle hard redirects
  const handleNavigation = (path) => {
    window.location.href = path;
    if (isOpen) {
      setIsOpen(false);
    }
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container-custom mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand Name - Positioned more to the left edge */}
          <div className="flex items-center ml-0 md:-ml-3">
            <a
              href="/"
              className="flex items-center"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/');
              }}
            >
              {/* Menggunakan tag img untuk logo dari public/icons/ayatku.png */}
            <img src="/icons/ayatku.png" alt="Ayatku Logo" className="h-20 w-25 mr-2" /> {/* Changed h-10 w-10 to h-12 w-12 for a larger logo */}
            </a>
          </div>

          {/* Desktop Navigation - With more space for navigation items */}
          <div className="hidden md:flex space-x-4 md:ml-6 flex-grow justify-center">
            <a
              href="/"
              className={`px-2 py-2 rounded-md font-medium transition-colors ${
                isActive('/')
                  ? 'text-emerald-600 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600'
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
              className={`px-2 py-2 rounded-md font-medium transition-colors ${
                isActive('/about')
                  ? 'text-emerald-600 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600'
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
              className={`px-2 py-2 rounded-md font-medium transition-colors ${
                isActive('/quran')
                  ? 'text-emerald-600 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/quran');
              }}
            >
              Al-Quran
            </a>
            <a
              href="/hadith"
              className={`px-2 py-2 rounded-md font-medium transition-colors ${
                isActive('/hadith')
                  ? 'text-emerald-600 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/hadith');
              }}
            >
              Hadist
            </a>
            <a
              href="/asmaulhusna"
              className={`px-2 py-2 rounded-md font-medium transition-colors ${
                isActive('/asmaulhusna')
                  ? 'text-emerald-600 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/asmaulhusna');
              }}
            >
              Asmaul Husna
            </a>
            <a
              href="/doa"
              className={`px-2 py-2 rounded-md font-medium transition-colors ${
                isActive('/doa')
                  ? 'text-emerald-600 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/doa');
              }}
            >
              Doa-doa
            </a>
            <a
              href="/calendar"
              className={`px-2 py-2 rounded-md font-medium transition-colors ${
                isActive('/calendar')
                  ? 'text-emerald-600 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/calendar');
              }}
            >
              Kalender
            </a>
            <a
              href="/kiblat"
              className={`px-2 py-2 rounded-md font-medium transition-colors ${
                isActive('/kiblat')
                  ? 'text-emerald-600 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/kiblat');
              }}
            >
              Kiblat
            </a>
            <a
              href="/blog"
              className={`px-2 py-2 rounded-md font-medium transition-colors ${
                isActive('/blog')
                  ? 'text-emerald-600 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/blog');
              }}
            >
              Artikel Islami
            </a>
            <a
              href="/prayer"
              className={`px-2 py-2 rounded-md font-medium transition-colors ${
                isActive('/prayer')
                  ? 'text-emerald-600 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/prayer');
              }}
            >
              Jadwal Sholat
            </a>
          </div>

          {/* Empty div for better spacing in desktop view */}
          <div className="hidden md:block w-20"></div>

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

      {/* Mobile Menu - Unchanged */}
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
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/');
              }}
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
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/about');
              }}
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
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/quran');
              }}
            >
              Al-Quran
            </a>
            <a
              href="/hadith"
              className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                isActive('/hadith')
                  ? 'text-emerald-600 bg-gray-50 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/hadith');
              }}
            >
              Hadist
            </a>
            <a
              href="/asmaulhusna"
              className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                isActive('/asmaulhusna')
                  ? 'text-emerald-600 bg-gray-50 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/asmaulhusna');
              }}
            >
              Asmaul Husna
            </a>
            <a
              href="/doa"
              className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                isActive('/doa')
                  ? 'text-emerald-600 bg-gray-50 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/doa');
              }}
            >
              Doa-doa
            </a>
            <a
              href="/calendar"
              className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                isActive('/calendar')
                  ? 'text-emerald-600 bg-gray-50 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/calendar');
              }}
            >
              Kalender Islam
            </a>
            <a
              href="/kiblat"
              className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                isActive('/kiblat')
                  ? 'text-emerald-600 bg-gray-50 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/kiblat');
              }}
            >
              Arah Kiblat
            </a>
            <a
              href="/blog"
              className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                isActive('/blog')
                  ? 'text-emerald-600 bg-gray-50 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/blog');
              }}
            >
              Artikel Islami
            </a>
            <a
              href="/prayer"
              className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                isActive('/prayer')
                  ? 'text-emerald-600 bg-gray-50 font-semibold'
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/prayer');
              }}
            >
              Jadwal Sholat & Imsak
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar