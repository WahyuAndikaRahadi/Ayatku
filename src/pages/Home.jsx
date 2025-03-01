import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaQuran, FaSearch, FaBookOpen, FaClock, FaBell, FaQuoteRight } from 'react-icons/fa'

const Home = () => {
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
                Baca Al-Quran & Dapatkan Pengingat Waktu Sholat
              </h1>
              <p className="text-lg mb-8 text-white/90">
                Platform lengkap untuk membaca Al-Quran, memahami tafsir, mencari ayat dengan cepat, serta mendapatkan pengingat otomatis waktu sholat dan imsak.
              </p>
              <Link to="/quran" className="bg-white text-primary hover:bg-white/90 font-bold py-3 px-6 rounded-lg inline-flex items-center">
                <FaQuran className="mr-2" /> Baca Sekarang
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
                alt="Ayatku"
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitur Baca Al-Quran */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaQuran className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Baca Al-Quran</h3>
              <p className="text-gray-600">
                Nikmati pengalaman membaca Al-Quran dengan tampilan nyaman dan disertai terjemahan Bahasa Indonesia.
              </p>
            </motion.div>

            {/* Fitur Pencarian Ayat */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaSearch className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pencarian Cepat</h3>
              <p className="text-gray-600">
                Temukan surah dan ayat dengan mudah berkat fitur pencarian yang akurat dan responsif.
              </p>
            </motion.div>

            {/* Fitur Tafsir Al-Quran */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaBookOpen className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tafsir Lengkap</h3>
              <p className="text-gray-600">
                Pelajari tafsir Al-Quran yang lengkap dan mendalam, membantu Anda memahami konteks ayat.
              </p>
            </motion.div>

            {/* Fitur Waktu Sholat & Imsak */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaClock className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Jadwal Sholat & Imsak</h3>
              <p className="text-gray-600">
                Dapatkan informasi waktu sholat dan imsak harian sesuai lokasi Anda.
              </p>
            </motion.div>

            {/* Fitur Reminder Notifikasi */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaBell className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pengingat Sholat</h3>
              <p className="text-gray-600">
                Ayatku akan memberikan notifikasi 5 menit sebelum waktu sholat tiba.
              </p>
            </motion.div>

            {/* Fitur Hadis Pilihan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FaQuoteRight className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hadis Harian</h3>
              <p className="text-gray-600">
                Dapatkan satu hadis pilihan setiap hari dari sumber terpercaya seperti Bukhari, Muslim, dan lainnya.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-secondary to-primary rounded-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Mari Dekatkan Diri dengan Al-Quran</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Dengan Ayatku, membaca, memahami, dan mengamalkan Al-Quran menjadi lebih mudah. Mulai perjalanan spiritual Anda hari ini.
            </p>
            <Link to="/quran" className="bg-white text-primary hover:bg-white/90 font-bold py-3 px-8 rounded-lg inline-block">
              Buka Al-Quran Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
