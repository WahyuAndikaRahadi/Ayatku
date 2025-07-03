import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const TasbihDigital = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33); // Default target for tasbih
  const [dzikirText, setDzikirText] = useState("Harian Sholat"); // Default dzikir text
  const [showTargetInput, setShowTargetInput] = useState(false);
  const [showDzikirInput, setShowDzikirInput] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Effect to load count, target, and dzikirText from localStorage
  useEffect(() => {
    const savedCount = localStorage.getItem('tasbihCount');
    const savedTarget = localStorage.getItem('tasbihTarget');
    const savedDzikirText = localStorage.getItem('tasbihDzikirText');

    if (savedCount !== null && savedCount !== '') {
      const parsedCount = parseInt(savedCount, 10);
      setCount(isNaN(parsedCount) ? 0 : parsedCount);
    } else {
      setCount(0);
    }

    if (savedTarget !== null && savedTarget !== '') {
      const parsedTarget = parseInt(savedTarget, 10);
      setTarget(isNaN(parsedTarget) || parsedTarget <= 0 ? 33 : parsedTarget);
    } else {
      setTarget(33);
    }

    if (savedDzikirText !== null) {
      setDzikirText(savedDzikirText);
    }
    setIsInitialized(true);
  }, []);

  // Effects to save state to localStorage (only after initialization)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tasbihCount', count.toString());
    }
  }, [count, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tasbihTarget', target.toString());
    }
  }, [target, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tasbihDzikirText', dzikirText);
    }
  }, [dzikirText, isInitialized]);

  const incrementCount = () => {
    setCount(prevCount => {
      const nextCount = prevCount + 1; // Hitungan berikutnya setelah diklik

      if (nextCount === target) { // Perubahan utama di sini: cek jika SAMA DENGAN target
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          icon: 'success',
          title: `Target ${target} tercapai! Dzikir diset ulang.`,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });
        return 0; // Langsung reset ke 0 setelah mencapai target
      }
      return nextCount; // Lanjutkan hitungan normal jika belum mencapai target
    });
  };

  const resetCount = () => {
    Swal.fire({
      title: 'Reset Tasbih?',
      text: "Anda yakin ingin mereset hitungan tasbih?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Reset!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        setCount(0);
        Swal.fire(
          'Direset!',
          'Hitungan tasbih Anda telah direset.',
          'success'
        );
      }
    });
  };

  const handleTargetChange = (e) => {
    const val = e.target.value;
    setTarget(val === '' ? 0 : Math.max(0, parseInt(val, 10) || 0));
  };

  const handleTargetBlur = () => {
    if (target === 0) setTarget(33);
    setShowTargetInput(false);
  };

  const handleDzikirTextChange = (e) => {
    setDzikirText(e.target.value);
  };


  return (
    <div className="container-custom py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">Tasbih Digital</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Permudah dzikir harian Anda dengan penghitung tasbih digital yang praktis
        </p>
      </motion.div>

      {/* Main Tasbih Counter */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col items-center justify-center max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto"
      >
        {/* Header Hitungan Dzikir */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-5 text-white w-full text-center rounded-t-2xl mb-6">
          <h2 className="text-xl font-semibold">Hitungan Dzikir</h2>
          <p className="text-emerald-100 text-sm">Ketuk untuk menghitung</p>
        </div>

        {/* Konten Utama Tasbih Counter */}
        <div className="px-6 md:px-8 pb-6 md:pb-8 w-full flex flex-col items-center">
            <div className="text-center mb-6 w-full">
              <p className="text-gray-700 text-lg font-medium mb-2">Dzikir Saat Ini:</p>
              {showDzikirInput ? (
                <input
                  type="text"
                  value={dzikirText}
                  onChange={handleDzikirTextChange}
                  onBlur={() => setShowDzikirInput(false)}
                  className="text-3xl md:text-4xl font-bold text-emerald-700 border-b-2 border-emerald-500 text-center w-full max-w-xs focus:outline-none focus:border-emerald-700 bg-white"
                  autoFocus
                />
              ) : (
                <h3
                  className="text-3xl md:text-4xl font-bold text-emerald-700 cursor-pointer hover:text-emerald-800 transition-colors"
                  onClick={() => setShowDzikirInput(true)}
                >
                  {dzikirText}
                </h3>
              )}
              <p className="text-gray-500 text-sm mt-1">Ketuk teks untuk mengedit</p>
            </div>

            <motion.div
              className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center cursor-pointer shadow-xl transform active:scale-95 transition-all duration-200 ease-out border-4 border-emerald-400"
              whileTap={{ scale: 0.95 }}
              onClick={incrementCount}
              style={{ userSelect: 'none' }}
            >
              <span className="text-white text-6xl md:text-8xl font-bold">{count}</span>
            </motion.div>

            <div className="mt-6 text-center w-full">
              <p className="text-gray-700 text-lg font-medium mb-2">Target Dzikir:</p>
              {showTargetInput ? (
                <input
                  type="number"
                  value={target === 0 ? '' : target}
                  onChange={handleTargetChange}
                  onBlur={() => {
                    if (target === 0) setTarget(33);
                    setShowTargetInput(false);
                  }}
                  className="text-3xl md:text-4xl font-bold text-emerald-700 border-b-2 border-emerald-500 text-center w-24 focus:outline-none focus:border-emerald-700 bg-white"
                  autoFocus
                />
              ) : (
                <h3
                  className="text-3xl md:text-4xl font-bold text-emerald-700 cursor-pointer hover:text-emerald-800 transition-colors"
                  onClick={() => setShowTargetInput(true)}
                >
                  {target}
                </h3>
              )}
              <p className="text-gray-500 text-sm mt-1">Ketuk angka untuk mengedit target</p>
            </div>

            <button
              onClick={resetCount}
              className="mt-8 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
        </div>
      </motion.div>

      {/* Petunjuk Penggunaan / Informasi Tambahan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto"
      >
        {/* Header Petunjuk & Manfaat */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white w-full text-center rounded-t-2xl mb-6">
          <h2 className="text-xl font-semibold">Petunjuk & Manfaat</h2>
          <p className="text-blue-100 text-sm">Panduan penggunaan tasbih digital</p>
        </div>

        {/* Konten Petunjuk & Manfaat: Tambahkan padding ke sini */}
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">Cara Menggunakan</span>
                </div>
                <p className="text-gray-600 text-sm mt-2 ml-12">
                  Cukup ketuk lingkaran besar di tengah untuk menambah hitungan dzikir Anda.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">Manfaat Dzikir</span>
                </div>
                <p className="text-gray-600 text-sm mt-2 ml-12">
                  Dzikir menenangkan hati, mendekatkan diri kepada Allah, dan mendatangkan pahala.
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">Pengaturan Fleksibel</span>
                </div>
                <p className="text-gray-600 text-sm mt-2 ml-12">
                  Anda dapat mengatur target hitungan dan mengubah teks dzikir sesuai keinginan.
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-xl">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">Penyimpanan Otomatis</span>
                </div>
                <p className="text-gray-600 text-sm mt-2 ml-12">
                  Hitungan Anda akan disimpan secara otomatis, bahkan jika Anda menutup aplikasi.
                </p>
              </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TasbihDigital;