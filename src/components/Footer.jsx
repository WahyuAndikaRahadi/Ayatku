import React from 'react';
import { FaQuran, FaHeart, FaGithub, FaEnvelope, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  
  // Warna yang diminta
  const colors = {
    primary: "#16a34a",
    secondary: "#0f766e",
    accent: "#fbbf24",
    neutral: "#1f2937",
  };

  return (
    <footer style={{ backgroundColor: colors.neutral }} className="text-white pt-6 pb-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <FaQuran className="text-accent text-xl" style={{ color: colors.accent }} />
              <span className="font-bold text-lg">Ayatku</span>
            </div>
            <p className="text-gray-300 text-sm max-w-md">
              Platform untuk membaca Al-Quran dan tafsirnya kapanpun dan dimanapun.
              Menyediakan akses ke sumber-sumber Islam yang terpercaya.
            </p>
          </div>
          
          <div className="flex flex-col items-center mb-4 md:mb-0">
            <div className="flex space-x-4 mb-2">
              <a 
                href="https://github.com/WahyuAndikaRahadi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-accent transition-colors"
                style={{ ':hover': { color: colors.accent } }}
              >
                <FaGithub size={20} />
              </a>
              <a 
                href="https://instagram.com/wahyuwuish" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-accent transition-colors"
                style={{ ':hover': { color: colors.accent } }}
              >
                <FaInstagram size={20} />
              </a>
            </div>
            <p className="text-gray-300 text-xs text-center">
              Dibuat Oleh Wahyu Andika Rahadi Dengan <FaHeart className="inline text-red-500" /> untuk umat Islam
            </p>
            <p className="text-gray-300 text-xs">
              &copy; {year} Ayatku | Seluruh Hak Cipta Dilindungi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;