import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaQuran,
  FaSearch,
  FaBookOpen,
  FaClock,
  FaBell, // Not used in this version, but kept from original imports
  FaQuoteRight,
  FaStar,
  FaCalendarAlt,
  FaCompass,
  FaComment,
  FaQuestionCircle, // New icon for AI Q&A
  FaHandshake,    // New icon for Digital Tasbih (or FaPray, FaHands)
  FaBook          // New icon for Islamic Dictionary
} from 'react-icons/fa';

const Home = () => {
  // Animation variants for features
  const featureItemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 mb-10 md:mb-0"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-snug">
                Platform Islami Lengkap untuk Kebutuhan Spiritual Anda
              </h1>
              <p className="text-lg mb-8 text-white/90">
                Al-Quran, Hadith, Asmaul Husna, Kalender Islam, Kiblat, dan berbagai konten islami lainnya dalam satu website untuk membantu perjalanan spiritual Anda.
              </p>
              <Link to="/quran" className="bg-white text-primary hover:bg-white/90 font-bold py-3 px-6 rounded-lg inline-flex items-center">
                <FaQuran className="mr-2" /> Baca Al-Quran
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-1/2 flex justify-center"
            >
              <img
                src="/icons/quran.png"
                alt="Ayatku Quran" // Descriptive alt text for SEO
                className="w-full max-w-md"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Fitur Unggulan Ayatku</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"> {/* Adjusted grid for more columns */}
            {/* Fitur Al-Quran */}
            <motion.div
              variants={featureItemVariants}
              initial="initial"
              whileInView="animate"
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaQuran className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Al-Quran Digital</h3>
              <p className="text-gray-600">
                Nikmati pengalaman membaca Al-Quran dengan tampilan nyaman, terjemahan, dan tafsir lengkap Bahasa Indonesia.
              </p>
              <Link to="/quran" className="text-primary font-medium mt-4 inline-block hover:underline">
                Baca Al-Quran →
              </Link>
            </motion.div>

            {/* Fitur Hadith */}
            <motion.div
              variants={featureItemVariants}
              initial="initial"
              whileInView="animate"
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaQuoteRight className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hadith Shahih</h3>
              <p className="text-gray-600">
                Koleksi hadith shahih dari berbagai sumber terpercaya seperti Bukhari, Muslim, dan lainnya dengan penjelasan lengkap.
              </p>
              <Link to="/hadith" className="text-primary font-medium mt-4 inline-block hover:underline">
                Baca Hadith →
              </Link>
            </motion.div>

            {/* Fitur Jadwal Sholat & Imsak */}
            <motion.div
              variants={featureItemVariants}
              initial="initial"
              whileInView="animate"
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaClock className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Jadwal Sholat & Imsak</h3>
              <p className="text-gray-600">
                Dapatkan jadwal sholat dan imsak akurat berdasarkan lokasi Anda dengan pengingat otomatis.
              </p>
              <Link to="/prayer" className="text-primary font-medium mt-4 inline-block hover:underline">
                Lihat Jadwal →
              </Link>
            </motion.div>

            {/* Fitur Asmaul Husna */}
            <motion.div
              variants={featureItemVariants}
              initial="initial"
              whileInView="animate"
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaStar className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Asmaul Husna</h3>
              <p className="text-gray-600">
                Pelajari 99 nama Allah dengan arti, penjelasan, dan keutamaan dari setiap nama-Nya.
              </p>
              <Link to="/asmaulhusna" className="text-primary font-medium mt-4 inline-block hover:underline">
                Lihat Asmaul Husna →
              </Link>
            </motion.div>

            {/* Fitur Kalender Hijriah */}
            <motion.div
              variants={featureItemVariants}
              initial="initial"
              whileInView="animate"
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaCalendarAlt className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Kalender Hijriah</h3>
              <p className="text-gray-600">
                Akses kalender Hijriah lengkap dengan tanggal-tanggal penting dalam Islam dan konversi ke kalender Masehi.
              </p>
              <Link to="/calendar" className="text-primary font-medium mt-4 inline-block hover:underline">
                Buka Kalender →
              </Link>
            </motion.div>

            {/* Fitur Pendeteksi Kiblat */}
            <motion.div
              variants={featureItemVariants}
              initial="initial"
              whileInView="animate"
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaCompass className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pendeteksi Kiblat</h3>
              <p className="text-gray-600">
                Temukan arah kiblat dengan mudah menggunakan teknologi GPS dan kompas di perangkat Anda.
              </p>
              <Link to="/kiblat" className="text-primary font-medium mt-4 inline-block hover:underline">
                Cari Arah Kiblat →
              </Link>
            </motion.div>

            {/* Fitur Kumpulan Doa */}
            <motion.div
              variants={featureItemVariants}
              initial="initial"
              whileInView="animate"
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaComment className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Kumpulan Doa</h3>
              <p className="text-gray-600">
                Pelajari dan amalkan doa-doa sehari-hari untuk berbagai situasi dengan lafaz Arab, terjemahan, dan tuntunan.
              </p>
              <Link to="/doa" className="text-primary font-medium mt-4 inline-block hover:underline">
                Lihat Doa →
              </Link>
            </motion.div>

            {/* Fitur Artikel Islami */}
            <motion.div
              variants={featureItemVariants}
              initial="initial"
              whileInView="animate"
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaBookOpen className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Artikel Islami</h3>
              <p className="text-gray-600">
                Baca dan diskusikan artikel islami terbaru tentang berbagai topik keagamaan dengan komunitas.
              </p>
              <Link to="/blog" className="text-primary font-medium mt-4 inline-block hover:underline">
                Baca Artikel →
              </Link>
            </motion.div>

            {/* NEW: Fitur AI Q&A */}
            <motion.div
              variants={featureItemVariants}
              initial="initial"
              whileInView="animate"
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaQuestionCircle className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Q&A (Tanya Jawab AI)</h3>
              <p className="text-gray-600">
                Dapatkan jawaban instan untuk pertanyaan seputar Islam dengan fitur tanya jawab berbasis kecerdasan buatan.
              </p>
              <Link to="/ai-qna" className="text-primary font-medium mt-4 inline-block hover:underline">
                Tanya AI →
              </Link>
            </motion.div>

            {/* NEW: Fitur Tasbih Digital */}
            <motion.div
              variants={featureItemVariants}
              initial="initial"
              whileInView="animate"
              transition={{ duration: 0.5, delay: 0.9 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaHandshake className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tasbih Digital</h3>
              <p className="text-gray-600">
                Hitung zikir Anda dengan mudah menggunakan tasbih digital yang intuitif dan nyaman.
              </p>
              <Link to="/tasbih-digital" className="text-primary font-medium mt-4 inline-block hover:underline">
                Gunakan Tasbih →
              </Link>
            </motion.div>

            {/* NEW: Fitur Kamus Islam */}
            <motion.div
              variants={featureItemVariants}
              initial="initial"
              whileInView="animate"
              transition={{ duration: 0.5, delay: 1.0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaBook className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Kamus Islam</h3>
              <p className="text-gray-600">
                Pahami istilah-istilah penting dalam Islam dengan kamus lengkap yang mudah dicari.
              </p>
              <Link to="/kamus-islam" className="text-primary font-medium mt-4 inline-block hover:underline">
                Buka Kamus →
              </Link>
            </motion.div>

            {/* About App (kept for consistency with original structure, but moved to end) */}
            <motion.div
              variants={featureItemVariants}
              initial="initial"
              whileInView="animate"
              transition={{ duration: 0.5, delay: 1.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaSearch className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tentang Kami</h3>
              <p className="text-gray-600">
                Pelajari lebih lanjut tentang visi dan misi kami dalam membantu umat Islam menjalani kehidupan spiritual.
              </p>
              <Link to="/about" className="text-primary font-medium mt-4 inline-block hover:underline">
                Tentang Kami →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-secondary to-primary rounded-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Mari Tingkatkan Kualitas Ibadah Bersama Ayatku</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Ayatku hadir sebagai pendamping spiritual Anda dalam beribadah dan memperdalam ilmu agama. Akses semua fitur spiritual dalam satu platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/quran" className="bg-white text-primary hover:bg-white/90 font-bold py-3 px-8 rounded-lg inline-block">
                Baca Al-Quran
              </Link>
              <Link to="/about" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg inline-block">
                Tentang Kami
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
