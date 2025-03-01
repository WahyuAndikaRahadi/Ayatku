import { motion } from 'framer-motion'
import { FaQuran, FaHeart, FaGithub, FaBell, FaBook } from 'react-icons/fa'

const About = () => {
  return (
    <div className="container-custom">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <FaQuran className="text-primary text-5xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Tentang Ayatku</h1>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="space-y-6 text-gray-700">
          <p>
            <strong>Ayatku</strong> adalah platform web yang dibuat untuk memudahkan umat Muslim dalam membaca, mempelajari, dan memahami Al-Quran. Aplikasi ini juga dilengkapi dengan fitur jadwal sholat, imsak, serta kutipan hadist harian untuk memperkaya ilmu agama penggunanya.
          </p>

          <p>
            Kami percaya bahwa teknologi dapat menjadi sarana untuk mendekatkan diri dengan Al-Quran dan memperkuat ibadah sehari-hari. Melalui platform ini, kami berharap dapat membantu pengguna membaca Al-Quran kapanpun dan dimanapun, sekaligus mengingatkan waktu sholat dan menyajikan inspirasi dari hadist.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Fitur Utama</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Membaca Al-Quran dengan tampilan yang jelas dan nyaman</li>
            <li>Terjemahan ayat-ayat Al-Quran dalam Bahasa Indonesia</li>
            <li>Tafsir Al-Quran untuk memahami makna dan konteks ayat</li>
            <li>Pencarian surah dan ayat yang cepat dan akurat</li>
            <li>Filter berdasarkan surah atau juz</li>
            <li>Jadwal Sholat dan Imsak harian yang selalu update</li>
            <li>Notifikasi web reminder 5 menit sebelum waktu sholat dan imsak</li>
            <li>Hadist harian dari kitab-kitab terpercaya seperti Muslim, Bukhari, Tirmidzi, dan lainnya</li>
            <li>Tampilan responsif yang dapat diakses dari berbagai perangkat</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">Teknologi</h2>
          <p>
            Aplikasi Ayatku dibuat menggunakan teknologi web modern, yaitu:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>React.js - Library JavaScript untuk membangun antarmuka pengguna</li>
            <li>Vite - Build tool yang cepat untuk aplikasi web modern</li>
            <li>Tailwind CSS - Framework CSS untuk desain yang fleksibel</li>
            <li>DaisyUI - Komponen UI untuk Tailwind CSS</li>
            <li>Framer Motion - Library untuk animasi yang halus</li>
            <li>SweetAlert2 - Library untuk notifikasi yang menarik</li>
            <li>API equran.id - Sumber data Al-Quran, terjemahan, dan tafsir</li>
            <li>API waktu-sholat.vercel.app - Sumber data waktu sholat & imsak</li>
            <li>API hadith.gading.dev - Sumber data hadist dari kitab-kitab terpercaya</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">Penafian</h2>
          <p>
            Ayatku menggunakan data dari beberapa API publik. Kami berusaha memastikan keakuratan data, namun jika Anda menemukan kesalahan, silakan hubungi kami atau merujuk pada sumber terpercaya.
          </p>

          <div className="text-center mt-10">
            <p className="italic">
              Dibuat Oleh Wahyu Andika Rahadi Dengan <FaHeart className="inline text-red-500" /> untuk umat Islam
            </p>
            <a 
              href="https://github.com/WahyuAndikaRahadi/Ayatku" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline mt-2"
            >
              <FaGithub className="mr-2" /> Lihat kode sumber di GitHub
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default About
