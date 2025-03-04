import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="container-custom py-12 min-h-screen flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto text-center"
      >
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Islamic Geometric Pattern */}
          <div className="mb-8 flex justify-center">
            <div className="w-40 h-40 md:w-48 md:h-48 relative">
              <div className="absolute inset-0 border-4 border-primary rotate-45"></div>
              <div className="absolute inset-0 border-4 border-primary"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl md:text-7xl text-primary font-arabic">٤٠٤</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Halaman Tidak Ditemukan
          </h1>
          
          <div className="mb-8 text-center">
            <p className="text-gray-600 text-lg mb-4">
              "Sesungguhnya kita adalah milik Allah, dan kepada-Nya lah kita kembali."
            </p>
            <p className="text-primary italic font-arabic text-xl mb-6">
              إِنَّا لِلَّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
            </p>
            <p className="text-gray-600">
              Mohon maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/"
              className="btn-primary"
            >
              Kembali ke Beranda
            </Link>
            
            <Link 
              to="/doa"
              className="btn-outline"
            >
              Jelajahi Doa-Doa
            </Link>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              "Dan Dialah yang memperkenankan doa orang yang berada dalam kesulitan."
              <br />
              <span className="italic">(QS. An-Naml: 62)</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;