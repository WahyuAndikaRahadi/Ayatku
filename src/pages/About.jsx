import { motion } from 'framer-motion';
import { FaQuran, FaHeart, FaGithub, FaBookOpen, FaClock, FaQuoteRight, FaStar, FaCalendarAlt, FaCompass, FaComment, FaQuestionCircle, FaHandshake, FaBook } from 'react-icons/fa';

const About = () => {
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: <FaQuran />,
      title: "Al-Quran Digital",
      description: "Membaca Al-Quran dengan tampilan yang jelas, terjemahan Bahasa Indonesia, tafsir lengkap, dan navigasi yang intuitif."
    },
    {
      icon: <FaQuoteRight />,
      title: "Hadith Shahih",
      description: "Koleksi hadith dari kitab-kitab terpercaya seperti Bukhari, Muslim, Tirmidzi, dan lainnya dengan penjelasan lengkap."
    },
    {
      icon: <FaClock />,
      title: "Jadwal Sholat & Imsak",
      description: "Jadwal sholat dan imsak yang akurat sesuai lokasi pengguna dengan notifikasi pengingat 5 menit sebelum waktu sholat."
    },
    {
      icon: <FaStar />,
      title: "Asmaul Husna",
      description: "Mempelajari 99 nama Allah dengan arti, penjelasan mendalam, dan keutamaan dari setiap nama-Nya."
    },
    {
      icon: <FaCalendarAlt />,
      title: "Kalender Hijriah",
      description: "Kalender Islam lengkap dengan penanggalan Hijriah dan Masehi serta informasi hari-hari penting dalam Islam."
    },
    {
      icon: <FaCompass />,
      title: "Pendeteksi Kiblat",
      description: "Menemukan arah kiblat dengan akurat menggunakan teknologi GPS dan kompas di perangkat pengguna."
    },
    {
      icon: <FaComment />,
      title: "Kumpulan Doa",
      description: "Koleksi doa-doa sehari-hari dengan lafaz Arab, terjemahan, dan petunjuk pengamalannya dalam berbagai situasi."
    },
    {
      icon: <FaBookOpen />,
      title: "Artikel Islami",
      description: "Artikel-artikel bermanfaat seputar kajian Islam untuk memperdalam pengetahuan agama."
    },
    {
      icon: <FaQuestionCircle />, // Icon for AI Q&A
      title: "AI Q&A (Tanya Jawab AI)",
      description: "Fitur tanya jawab berbasis kecerdasan buatan untuk mendapatkan jawaban cepat seputar Islam."
    },
    {
      icon: <FaHandshake />, // Icon for Digital Tasbih
      title: "Tasbih Digital",
      description: "Tasbih digital yang mudah digunakan untuk membantu Anda berzikir dan menghitung bacaan."
    },
    {
      icon: <FaBook />, // Icon for Islamic Dictionary
      title: "Kamus Islam",
      description: "Kamus istilah-istilah Islam lengkap dengan makna, kategori, dan contoh penggunaan."
    }
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
            // Increased size from w-20 h-20 to w-32 h-32
            className="w-32 h-32 flex items-center justify-center mx-auto mb-6"
          >
            {/* Replaced FaQuran with img tag */}
            <img src="/icons/ayatku.png" alt="Ayatku Logo" className="w-full h-full object-contain p-2" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-3 text-gray-800">Tentang Ayatku</h1>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Platform islami lengkap untuk memenuhi kebutuhan spiritual umat Muslim Indonesia
          </p>
        </div>

        {/* Vision and Mission */}
        <div className="space-y-6 text-gray-700 mb-12">
          <p className="text-lg">
            <strong className="text-primary">Ayatku</strong> adalah platform digital yang dibuat untuk memudahkan umat Muslim dalam menjalankan ibadah, membaca Al-Quran, dan memperdalam ilmu agama. Kami hadir sebagai pendamping spiritual dalam kehidupan sehari-hari.
          </p>

          <p>
            Kami percaya bahwa teknologi dapat menjadi sarana untuk mendekatkan diri dengan Al-Quran dan memperkuat ibadah. Melalui platform Ayatku, kami berharap dapat membantu Anda mengakses konten islami berkualitas kapanpun dan dimanapun, sambil menyediakan alat-alat praktis untuk mendukung kehidupan spiritual.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-6 text-gray-800">Visi & Misi</h2>

          <div className="bg-primary/5 p-6 rounded-lg">
            <h3 className="font-bold text-primary mb-2">Visi</h3>
            <p>Menjadi platform islami terdepan yang memudahkan umat Muslim Indonesia dalam beribadah dan memperdalam ilmu agama melalui teknologi yang inovatif dan ramah pengguna.</p>
          </div>

          <div className="bg-secondary/5 p-6 rounded-lg">
            <h3 className="font-bold text-secondary mb-2">Misi</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Menyediakan akses Al-Quran digital yang mudah dengan terjemahan dan tafsir yang akurat</li>
              <li>Menghadirkan konten islami berkualitas untuk memperkaya pengetahuan agama</li>
              <li>Membantu umat Muslim dalam menjalankan ibadah dengan fitur jadwal sholat dan pendeteksi kiblat</li>
              <li>Meningkatkan kedekatan dengan ajaran Islam melalui teknologi yang inovatif</li>
              <li>Membangun komunitas islami digital yang saling mendukung</li>
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
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Technology Section */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Teknologi</h2>
        <p className="mb-4">
          Ayatku dibangun menggunakan teknologi web modern yang fokus pada performa dan pengalaman pengguna:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2 text-gray-800">Frontend</h3>
            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• React.js</li>
              <li>• Vite</li>
              <li>• Tailwind CSS</li>
              <li>• DaisyUI Components</li>
              <li>• Framer Motion</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2 text-gray-800">Backend & Data</h3>
            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• RESTful APIs</li>
              <li>• Open-source Al-Quran API</li>
              <li>• Open-source Hadith API</li>
              <li>• Open-source Prayer Times API</li>
              <li>• Geolocation Services</li>
              <li>• Gemini API Integration</li> {/* Added Gemini API */}
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2 text-gray-800">Pengalaman Pengguna</h3>
            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• Responsive Design</li>
              <li>• Navigation Al-Quran</li>
              <li>• SweetAlert2 Notifications</li>
              <li>• Pagination Pages</li>
              <li>• can listen to the Quran read by scholars</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="bg-gray-50 p-6 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Penafian</h2>
          <p className="text-gray-600">
            Ayatku menggunakan data dari berbagai API publik dan sumber terbuka. Kami berusaha memastikan keakuratan data, namun jika Anda menemukan kesalahan atau ketidaksesuaian, silakan hubungi kami atau merujuk pada sumber-sumber terpercaya. Konten di Ayatku disediakan untuk tujuan pendidikan dan informasi saja, dan tidak dapat menggantikan bimbingan dari ulama atau ahli agama.
          </p>
        </div>

        {/* Credits Section */}
        <div className="text-center mt-12 border-t pt-8">
          <p className="italic text-gray-600 mb-4">
            Dibuat dengan <FaHeart className="inline text-red-500 mx-1" /> oleh Wahyu Andika Rahadi untuk umat Islam Indonesia
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://github.com/WahyuAndikaRahadi/Ayatku"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline"
            >
              <FaGithub className="mr-2" /> Lihat kode sumber di GitHub
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
