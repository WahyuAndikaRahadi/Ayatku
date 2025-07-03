import React from 'react';
import { FaHeart, FaGithub, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-emerald-800 to-emerald-700 p-8 text-white relative overflow-hidden">
      {/* Overlay Pola Islami Emas (tetap pakai gambar jika ada untuk pola background) */}
      <div
        className="absolute inset-0 z-0 opacity-10 bg-repeat animate-fade-in"
        style={{
          backgroundImage: "url('/icons/islamic-pattern-gold.png')", // Anda bisa tetap pakai pola ini
          backgroundSize: '200px',
          backgroundBlendMode: 'overlay',
        }}
      ></div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-center py-6">
          {/* Bagian Kiri: Logo dan Deskripsi */}
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <Link
                to="/"
                className="
                  relative flex items-center justify-center
                  w-[112px] h-[112px] p-2 rounded-xl
                  
                 
                  before:content-['']
                  before:absolute
                  before:inset-[-8px] // Posisi border di luar logo
                  before:rounded-2xl // Sedikit lebih bulat dari logo
                  before:z-0 // Di belakang logo
                  
                  // Warna Emas dengan Gradient untuk kedalaman
                  before:bg-gradient-to-br from-amber-400 via-amber-200 to-amber-400
                  
                  // Bayangan untuk efek ukiran
                  before:shadow-[0_0_15px_rgba(255,223,0,0.7),_inset_0_0_10px_rgba(255,223,0,0.5)]
                  
                  // Opsional: Efek animasi ringan atau hover
                  before:transition-all before:duration-300
                  hover:before:inset-[-12px] hover:before:shadow-[0_0_20px_rgba(255,223,0,0.9),_inset_0_0_15px_rgba(255,223,0,0.7)]
                "
              >
                {/* Logo Ayatku */}
                <img
                  src="/icons/ayatku.png"
                  alt="Ayatku Logo"
                  className="h-full w-full object-contain relative z-10 rounded-lg shadow-inner" // Logo di atas border, sedikit shadow
                />
              </Link>
            </div>
            <p className="text-gray-100 text-base md:text-lg max-w-md leading-relaxed font-light">
              Platform untuk membaca Al-Quran dan tafsirnya kapanpun dan dimanapun.
              Menyediakan akses ke sumber-sumber Islam yang terpercaya untuk kemudahan ibadah Anda.
            </p>
          </div>

          {/* Bagian Kanan: Sosial Media dan Copyright */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <div className="flex space-x-8 mb-4">
              <a
                href="https://github.com/WahyuAndikaRahadi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-200 hover:text-amber-400 transition-colors duration-300 transform hover:scale-115"
                aria-label="Visit my GitHub profile"
              >
                <FaGithub size={30} />
              </a>
              <a
                href="https://instagram.com/wahyuwuish"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-200 hover:text-amber-400 transition-colors duration-300 transform hover:scale-115"
                aria-label="Visit my Instagram profile"
              >
                <FaInstagram size={30} />
              </a>
            </div>
            <p className="text-gray-100 text-sm md:text-base mb-2 font-light">
              Dibuat Oleh <strong className="font-semibold text-amber-200">Wahyu Andika Rahadi</strong> Dengan <FaHeart className="inline text-red-400 animate-pulse" /> untuk umat Islam.
            </p>
            <p className="text-gray-100 text-sm md:text-base font-light">
              &copy; {year} Ayatku | Seluruh Hak Cipta Dilindungi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;