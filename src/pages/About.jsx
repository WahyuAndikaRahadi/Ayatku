import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaQuran, FaHeart, FaGithub, FaBookOpen, FaClock, FaQuoteRight, 
  FaStar, FaCalendarAlt, FaCompass, FaComment, FaQuestionCircle, 
  FaHandshake, FaBook, FaDownload, FaCheckCircle 
} from 'react-icons/fa';

const About = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Cek apakah aplikasi sudah dalam mode standalone (terinstall)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }

    // 2. Tangkap event instalasi dari browser
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e); // Browser mendeteksi aplikasi BISA didownload
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleDownload = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  const features = [
    { icon: <FaQuran />, title: "Al-Quran Digital", description: "Membaca Al-Quran dengan tampilan yang jelas, terjemahan Bahasa Indonesia, tafsir lengkap, dan navigasi yang intuitif." },
    { icon: <FaQuoteRight />, title: "Hadith Shahih", description: "Koleksi hadith dari kitab-kitab terpercaya seperti Bukhari, Muslim, Tirmidzi, dan lainnya dengan penjelasan lengkap." },
    { icon: <FaClock />, title: "Jadwal Sholat & Imsak", description: "Jadwal sholat dan imsak yang akurat sesuai lokasi pengguna dengan notifikasi pengingat 5 menit sebelum waktu sholat." },
    { icon: <FaStar />, title: "Asmaul Husna", description: "Mempelajari 99 nama Allah dengan arti, penjelasan mendalam, dan keutamaan dari setiap nama-Nya." },
    { icon: <FaCalendarAlt />, title: "Kalender Hijriah", description: "Kalender Islam lengkap dengan penanggalan Hijriah dan Masehi serta informasi hari-hari penting dalam Islam." },
    { icon: <FaCompass />, title: "Pendeteksi Kiblat", description: "Menemukan arah kiblat dengan akurat menggunakan teknologi GPS dan kompas di perangkat pengguna." },
    { icon: <FaComment />, title: "Kumpulan Doa", description: "Koleksi doa-doa sehari-hari dengan lafaz Arab, terjemahan, dan petunjuk pengamalannya dalam berbagai situasi." },
    { icon: <FaBookOpen />, title: "Artikel Islami", description: "Artikel-artikel bermanfaat seputar kajian Islam untuk memperdalam pengetahuan agama." },
    { icon: <FaQuestionCircle />, title: "AI Q&A (Tanya Jawab AI)", description: "Fitur tanya jawab berbasis kecerdasan buatan untuk mendapatkan jawaban cepat seputar Islam." },
    { icon: <FaHandshake />, title: "Tasbih Digital", description: "Tasbih digital yang mudah digunakan untuk membantu Anda berzikir dan menghitung bacaan." },
    { icon: <FaBook />, title: "Kamus Islam", description: "Kamus istilah-istilah Islam lengkap dengan makna, kategori, dan contoh penggunaan." }
  ];

  return (
    <div className="container-custom py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-32 h-32 flex items-center justify-center mx-auto mb-6"
          >
            <img src="/icons/ayatku.png" alt="Ayatku Logo" className="w-full h-full object-contain p-2" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-3 text-gray-800">Tentang Ayatku</h1>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Platform islami lengkap untuk memenuhi kebutuhan spiritual umat Muslim Indonesia
          </p>

          {/* Tombol Download dengan Deteksi Langsung */}
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              {isInstalled ? (
                <motion.div 
                  key="installed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-xl font-bold border border-green-200"
                >
                  <FaCheckCircle /> Aplikasi Terpasang
                </motion.div>
              ) : deferredPrompt ? (
                <motion.button 
                  key="download"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:brightness-90 transition-all"
                >
                  <FaDownload className="animate-bounce" /> Download Aplikasi Ayatku
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Vision and Mission */}
        <div className="space-y-6 text-gray-700 mb-12 border-t pt-10">
          <p className="text-lg">
            <strong className="text-primary">Ayatku</strong> adalah platform digital yang dibuat untuk memudahkan umat Muslim dalam menjalankan ibadah, membaca Al-Quran, dan memperdalam ilmu agama.
          </p>
          <div className="bg-primary/5 p-6 rounded-lg">
            <h3 className="font-bold text-primary mb-2">Visi</h3>
            <p>Menjadi platform islami terdepan yang memudahkan umat Muslim Indonesia melalui teknologi inovatif.</p>
          </div>
          <div className="bg-secondary/5 p-6 rounded-lg">
            <h3 className="font-bold text-secondary mb-2">Misi</h3>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Menyediakan akses Al-Quran digital yang mudah dan akurat.</li>
              <li>Membantu ibadah harian dengan fitur jadwal sholat dan kiblat.</li>
              <li>Membangun komunitas islami digital yang saling mendukung.</li>
            </ul>
          </div>
        </div>

        {/* Feature Section */}
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Fitur Unggulan Ayatku</h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow flex"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-primary text-xl">{feature.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Technology Section */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Teknologi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12 text-sm">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2 text-gray-800">Frontend</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• React.js & Vite</li>
              <li>• Tailwind CSS</li>
              <li>• Framer Motion</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2 text-gray-800">Backend & Data</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Open-source APIs</li>
              <li>• Gemini AI</li>
              <li>• Geolocation</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2 text-gray-800">Support</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• PWA (Installable)</li>
              <li>• Responsive Design</li>
              <li>• Offline Ready</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="bg-gray-50 p-6 rounded-lg mb-10 text-sm">
          <h2 className="text-xl font-bold mb-2 text-gray-800">Penafian</h2>
          <p className="text-gray-600 italic leading-relaxed">
            Ayatku menggunakan data dari API publik. Konten disediakan untuk edukasi dan tidak menggantikan bimbingan ulama.
          </p>
        </div>

        {/* Credits Section */}
        <div className="text-center mt-12 border-t pt-8">
          <p className="italic text-gray-600 mb-4 flex items-center justify-center gap-1">
            Dibuat dengan <FaHeart className="text-red-500" /> oleh Wahyu Andika Rahadi
          </p>
          <a
            href="https://github.com/WahyuAndikaRahadi/Ayatku"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:underline text-sm font-bold"
          >
            <FaGithub className="mr-2" /> GitHub Source Code
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default About;